"""P3-GLASSES stage 1 (headless only, no MCP).
Import -> orient -> scale(0.104) -> recenter -> split L/R -> join
G_Front / G_Lens_L / G_Lens_R / G_Arm_L / G_Arm_R -> hinge pivots ->
fold-angle solver w/ BVHTree intersection test -> folded dims JSON ->
fold drivers on G_Root -> save blender/glasses_rigged.blend
"""
import bpy, bmesh, json, math, os
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

WS = "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"
SRC = "/Users/admin/Downloads/Glasses_Mama_WBL/Glasses_Mama_WBL.obj"
BLEND = os.path.join(WS, "blender/glasses_rigged.blend")
DIMS = os.path.join(WS, "blender/glasses_folded_dims.json")
TMPINFO = os.path.join(WS, ".orchestration/tmp/glasses_stage1.json")

# ---- clean scene ----
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.images,
             bpy.data.actions, bpy.data.armatures):
    for x in list(coll):
        try: coll.remove(x)
        except Exception: pass

# ---- import ----
bpy.ops.wm.obj_import(filepath=SRC)
imported = [o for o in bpy.context.scene.objects if o.type == 'MESH']
print("IMPORTED:", [(o.name, len(o.data.vertices)) for o in imported])
by_name = {o.name: o for o in imported}

def bbox_world(obs):
    pts = []
    for o in obs:
        pts += [o.matrix_world @ v.co for v in o.data.vertices]
    mn = Vector((min(p[i] for p in pts) for i in range(3)))
    mx = Vector((max(p[i] for p in pts) for i in range(3)))
    return mn, mx

SCALE = 104.0 / 1000.0  # 1 unit ~= 104 mm -> metres (G-verified)

# ---- orientation check BEFORE scale: lenses must sit at -Y (front=-Y) ----
lens = by_name['Vert.003']
tips = by_name['\u5e73\u9762']
lm = sum((v.co for v in lens.data.vertices), Vector()) / len(lens.data.vertices)
tm = sum((v.co for v in tips.data.vertices), Vector()) / len(tips.data.vertices)
print("lens centroid", tuple(lm), " tips centroid", tuple(tm))
assert lm.z > tm.z, "unexpected: lenses should be at +Z(obj) front"
# default import maps obj(x,y,z)->blend(x,-z,y) ? verify via bboxes below.

# ---- uniform scale about world origin (bake into mesh data; transforms stay identity) ----
mn, mx = bbox_world(imported)
width_native = mx.x - mn.x
S = 0.140 / width_native
print(f"width_native={width_native:.5f} scale={S:.6f} (target ~{SCALE})")
SM = Matrix.Scale(S, 4)
for o in imported:
    o.data.transform(SM)
    o.matrix_world.identity()
for m in bpy.data.meshes:
    m.update()

# ---- verify orientation in Blender space ----
lb = [lens.matrix_world @ v.co for v in lens.data.vertices]
tb = [tips.matrix_world @ v.co for v in tips.data.vertices]
lcy = sum(v.y for v in lb) / len(lb)
tcy = sum(v.y for v in tb) / len(tb)
print(f"lens Y centre {lcy:.4f}  tips Y centre {tcy:.4f} (front must be -Y)")
if not (lcy < tcy):
    print("ROTATING 180deg about Z to face front -Y")
    R = Matrix.Rotation(math.pi, 4, 'Z')
    for o in imported:
        o.data.transform(R)

# ---- recenter: lens bbox centre -> origin ----
lc = sum((v.co for v in lens.data.vertices), Vector()) / len(lens.data.vertices)
print("lens centroid (scaled):", tuple(lc), "m")
T = Matrix.Translation(-lc)
for o in imported:
    o.data.transform(T)

info = {"scale_applied": S, "recenter_lens_centre_m": list(lc)}

# ---- split helper: duplicate mesh, keep one X side ----
def split_side(src, keep, new_name, tol=2e-4):
    me = src.data.copy()
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.verts.ensure_lookup_table()
    if keep == 'R':
        kill = [v for v in bm.verts if v.co.x < -tol]
        cross = [f for f in bm.faces
                 if any(v.co.x < -tol for v in f.verts) and any(v.co.x > tol for v in f.verts)]
    else:
        kill = [v for v in bm.verts if v.co.x > tol]
        cross = [f for f in bm.faces
                 if any(v.co.x > tol for v in f.verts) and any(v.co.x < -tol for v in f.verts)]
    if cross:
        print(f"  WARN {src.name} {keep}: {len(cross)} crossing faces (tol={tol})")
    bmesh.ops.delete(bm, geom=kill, context='VERTS')
    bm.to_mesh(me)
    bm.free()
    me.update()
    if len(me.vertices) == 0:
        bpy.data.meshes.remove(me)
        return None
    ob = bpy.data.objects.new(new_name, me)
    bpy.context.scene.collection.objects.link(ob)
    for m in src.data.materials:
        me.materials.append(m)
    return ob

N = {
 'lens': 'Vert.003',
 'tip': '\u5e73\u9762',
 'rod': '\u5186\u67f1.002',
 'cap': 'Vert',
 'barrel': '\u5186\u67f1',
}
parts = {}
for base_key, oname in [('lens', N['lens']), ('tip', N['tip']), ('rod', N['rod']),
                        ('cap', N['cap']), ('barrel', N['barrel'])]:
    src = by_name[oname]
    xs = sorted(abs(v.co.x) for v in src.data.vertices)
    print(f"{oname}: min|x|={xs[0]*1000:.3f}mm n={len(xs)}")
    for side in ('L', 'R'):
        o = split_side(src, side, f"PART_{base_key}_{side}")
        assert o is not None, f"empty split {base_key} {side}"
        parts[(base_key, side)] = o
        print(f"  split {oname} {side}: {len(o.data.vertices)} verts")

# barrel long-axis check (per side): is hinge axis ~vertical (Blender Z)?
for side in ('L', 'R'):
    o = parts[('barrel', side)]
    xs = [v.co.x for v in o.data.vertices]; ys = [v.co.y for v in o.data.vertices]; zs = [v.co.z for v in o.data.vertices]
    ex, ey, ez = max(xs)-min(xs), max(ys)-min(ys), max(zs)-min(zs)
    print(f"barrel {side} extents mm x={ex*1000:.1f} y={ey*1000:.1f} z={ez*1000:.1f}")

# ---- join helper (ops-based, headless-safe) ----
def join_into(obs, name):
    for o in bpy.data.objects:
        o.select_set(False)
    for o in obs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = obs[0]
    bpy.ops.object.join()
    joined = bpy.context.view_layer.objects.active
    joined.name = name
    return joined

lenses = {}
for side in ('L', 'R'):
    o = parts[('lens', side)]
    o.name = f"G_Lens_{side}"
    lenses[side] = o

arms = {}
for side in ('L', 'R'):
    a = join_into([parts[('rod', side)], parts[('tip', side)], parts[('cap', side)]], f"G_Arm_{side}")
    arms[side] = a
    print(f"{a.name}: {len(a.data.vertices)} verts, {len(a.data.polygons)} polys")

FRONT_NAMES = ['Vert.001', '\u7acb\u65b9\u4f53_\u7acb\u65b9\u4f53.004',
               '\u5186\u67f1',  # barrels stay static (coaxial w/ fold axis)
               '\u7403',        # junction caps static
               '\u7403.001', '\u7acb\u65b9\u4f53.001_\u7acb\u65b9\u4f53.006',
               '\u5186\u67f1.001', '\u7acb\u65b9\u4f53.002_\u7acb\u65b9\u4f53.007',
               '\u7acb\u65b9\u4f53_\u7acb\u65b9\u4f53.001']  # hinge wires, front side static
front_obs = [by_name[n] for n in FRONT_NAMES]
G_Front = join_into(front_obs, "G_Front")
print(f"G_Front: {len(G_Front.data.vertices)} verts, {len(G_Front.data.polygons)} polys")

for side in ('L', 'R'):
    o = parts[('barrel', side)]
    bpy.data.objects.remove(o, do_unlink=True)

# ---- hinge pivots: frame-side 5% Y-centroid of each arm ----
pivots = {}
for side in ('L', 'R'):
    a = arms[side]
    vs = sorted(a.data.vertices, key=lambda v: v.co.y)
    n = max(8, len(vs) // 20)
    c = sum((v.co for v in vs[:n]), Vector()) / n
    pivots[side] = Vector((c.x, c.y, c.z))
    print(f"pivot {side}: {tuple(round(v,5) for v in c)} (n={n})")
    a.data.transform(Matrix.Translation(-c))
    a.location = c

info["pivots_m"] = {s: list(map(float, pivots[s])) for s in pivots}

# ---- G_Root empty at frame centre (origin) ----
root = bpy.data.objects.new("G_Root", None)
bpy.context.scene.collection.objects.link(root)
root.location = (0, 0, 0)
for o in [G_Front, lenses['L'], lenses['R'], arms['L'], arms['R']]:
    o.parent = root
    o.matrix_parent_inverse.identity()

# ---- BVH helpers for fold solve ----
def tris_of(ob, mat=None):
    me = ob.data
    vv = [Vector(v.co) for v in me.vertices]
    if mat is not None:
        vv = [mat @ v for v in vv]
    faces = [tuple(p.vertices) for p in me.polygons]
    return vv, faces

def world_tris(ob):
    return tris_of(ob, ob.matrix_world)

def overlap_count(bvh_a, bvh_b):
    try:
        return len(bvh_a.overlap(bvh_b))
    except Exception as e:
        print("overlap err", e)
        return -1

def folded_bvh(ob, pivot, angle_rad):
    M = Matrix.Translation(pivot) @ Matrix.Rotation(angle_rad, 4, 'Z') @ Matrix.Translation(-pivot)
    vv = [M @ (ob.location + v.co) for v in ob.data.vertices]
    faces = [tuple(p.vertices) for p in ob.data.polygons]
    return BVHTree.FromPolygons(vv, faces, epsilon=1e-6)

lens_bvh = {s: BVHTree.FromPolygons(*((lambda t: (t[0], t[1]))(world_tris(lenses[s]))), epsilon=1e-6) for s in ('L','R')}
front_bvh = BVHTree.FromPolygons(*((lambda t: (t[0], t[1]))(world_tris(G_Front))), epsilon=1e-6)

def cost(thR_deg, thL_deg):
    thR = math.radians(thR_deg); thL = math.radians(-thL_deg)
    bR = folded_bvh(arms['R'], pivots['R'], thR)
    bL = folded_bvh(arms['L'], pivots['L'], thL)
    c = 0
    c += overlap_count(bR, bL) * 10
    for s, lb in lens_bvh.items():
        c += overlap_count(bR, lb) * 10
        c += overlap_count(bL, lb) * 10
    c += overlap_count(bR, front_bvh) * 5
    c += overlap_count(bL, front_bvh) * 5
    return c

best = None
for thR in range(85, 101):
    for thL in range(85, 101):
        c = cost(thR, thL)
        key = (c, abs(thR-90)+abs(thL-90), -min(thR,thL))
        if best is None or key < best[0]:
            best = (key, thR, thL, c)
_, bestR, bestL, bestc = best
print(f"BEST fold: R={bestR}deg L={bestL}deg cost={bestc}")
for thR, thL in [(90,90),(90,93),(93,93),(95,95),(92,95)]:
    print(f"  cost R={thR} L={thL}: {cost(thR,thL)}")
info["fold_deg"] = {"R": bestR, "L": bestL, "cost": bestc, "note": "R=+Zrot, L=-Zrot; right under, left over"}

# ---- drivers ----
root["fold"] = 0.0
ui = root.id_properties_ui("fold")
ui.update(min=0.0, max=1.0, description="0=open, 1=folded")
thR_rad = math.radians(bestR); thL_rad = math.radians(bestL)

def add_fold_driver(ob, expr):
    fc = ob.driver_add('rotation_euler', 2)
    d = fc.driver
    d.type = 'SCRIPTED'
    d.expression = expr
    v = d.variables.new()
    v.name = "fold"
    v.type = 'SINGLE_PROP'
    t = v.targets[0]
    t.id = root
    t.data_path = '["fold"]'

eR = f"{thR_rad:.6f}*(3*(min(max(fold/0.9,0),1))**2-2*(min(max(fold/0.9,0),1))**3)"
eL = f"-{thL_rad:.6f}*(3*(min(max((fold-0.15)/0.85,0),1))**2-2*(min(max((fold-0.15)/0.85,0),1))**3)"
add_fold_driver(arms['R'], eR)
add_fold_driver(arms['L'], eL)
print("drivers:", eR[:60], "...", eL[:60], "...")

# ---- FOLDED DIMS (early, before materials) ----
root["fold"] = 1.0
bpy.context.view_layer.update()
dg = bpy.context.evaluated_depsgraph_get()
dg.update()
mn, mx = bbox_world([G_Front, lenses['L'], lenses['R'], arms['L'], arms['R']])
size_mm = [(mx[i]-mn[i])*1000.0 for i in range(3)]
print("FOLDED bbox min", tuple(mn), "max", tuple(mx))
print("FOLDED size mm LxWxH(x,y,z) =", size_mm)
dims = {"folded_bbox_m": {"min": list(map(float, mn)), "max": list(map(float, mx))},
        "folded_size_mm": {"x": size_mm[0], "y": size_mm[1], "z": size_mm[2]},
        "fold_deg": info["fold_deg"], "frame_width_m": 0.140, "scale": S}
with open(DIMS, "w") as f:
    json.dump(dims, f, indent=2)
print("WROTE", DIMS)

# ---- intersection verification at fold=1.0 ----
bR = BVHTree.FromPolygons(*((lambda t:(t[0],t[1]))(world_tris(arms['R']))), epsilon=1e-6)
bL = BVHTree.FromPolygons(*((lambda t:(t[0],t[1]))(world_tris(arms['L']))), epsilon=1e-6)
lbL = BVHTree.FromPolygons(*((lambda t:(t[0],t[1]))(world_tris(lenses['L']))), epsilon=1e-6)
lbR = BVHTree.FromPolygons(*((lambda t:(t[0],t[1]))(world_tris(lenses['R']))), epsilon=1e-6)
fb = BVHTree.FromPolygons(*((lambda t:(t[0],t[1]))(world_tris(G_Front))), epsilon=1e-6)
ver = {"armR_armL": len(bR.overlap(bL)),
       "armR_lensR": len(bR.overlap(lbR)), "armR_lensL": len(bR.overlap(lbL)),
       "armL_lensR": len(bL.overlap(lbR)), "armL_lensL": len(bL.overlap(lbL)),
       "armR_front": len(bR.overlap(fb)), "armL_front": len(bL.overlap(fb))}
print("INTERSECT@fold=1:", ver)
info["intersect_fold1"] = ver

root["fold"] = 0.0
bpy.context.view_layer.update()

# ---- tri counts ----
tris = {}
for o in [G_Front, lenses['L'], lenses['R'], arms['L'], arms['R']]:
    me = o.data
    tris[o.name] = sum(len(p.vertices)-2 for p in me.polygons)
tris["TOTAL"] = sum(tris.values())
print("TRIS:", tris)
info["tris"] = tris

with open(TMPINFO, "w") as f:
    json.dump(info, f, indent=2)

bpy.ops.wm.save_as_mainfile(filepath=BLEND)
print("SAVED", BLEND)
