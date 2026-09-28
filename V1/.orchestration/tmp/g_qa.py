import bpy, bmesh, os
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for m in list(bpy.data.materials): bpy.data.materials.remove(m)
bpy.ops.wm.obj_import(filepath='/Users/admin/Downloads/Glasses_Mama_WBL/Glasses_Mama_WBL.obj', up_axis='Y', forward_axis='NEGATIVE_Z')
print('=== PER-OBJECT QA (Blender space) ===')
for ob in sorted([o for o in bpy.context.scene.objects if o.type=='MESH'], key=lambda o:o.name):
    me=ob.data
    bm=bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table()
    nonman=sum(1 for e in bm.edges if not e.is_manifold)
    loose=sum(1 for v in bm.verts if not v.link_edges)
    # zero-area faces
    za=sum(1 for f in bm.faces if f.calc_area()<1e-10)
    # uv coverage
    uv=me.uv_layers[0] if me.uv_layers else None
    uvs=set()
    if uv:
        for poly in me.polygons:
            for li in poly.loop_indices:
                uvs.add((round(uv.data[li].uv.x,3),round(uv.data[li].uv.y,3)))
    bb=[ob.matrix_world @ Vector(c) for c in ob.bound_box]
    mn=Vector((min(c[i] for c in bb) for i in range(3))); mx=Vector((max(c[i] for c in bb) for i in range(3)))
    print(f"{ob.name!r}: nonman_edges={nonman} loose_verts={loose} zeroarea_faces={za} unique_uvs={len(uvs)} bbox=({tuple(round(v,3) for v in mn)},{tuple(round(v,3) for v in mx)})")
    bm.free()
print('=== HINGE ESTIMATE from arm object 円柱.002 ===')
ob=bpy.context.scene.objects.get('円柱.002')
if ob:
    mw=ob.matrix_world
    for side,s in (('R',1),('L',-1)):
        pts=[mw@v.co for v in ob.data.vertices if (v.co.x>0)==(s>0)]
        # front-most 5% in Y (front of glasses = +Y in Blender space? check)
        pts_sorted=sorted(pts,key=lambda p:p.y)
        print(side,'Y range:',round(min(p.y for p in pts),3),round(max(p.y for p in pts),3))
        front=[p for p in pts if p.y>sorted([p.y for p in pts])[int(len(pts)*0.95)]]
        c=sum(front,Vector())/len(front)
        print(side,'front5% centroid (hinge approx):',tuple(round(v,4) for v in c))
print('=== GLB EXPORT SIZES ===')
tmp='/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1/.orchestration/tmp'
bpy.ops.object.select_all(action='SELECT')
p1=os.path.join(tmp,'g_full.glb')
bpy.ops.export_scene.gltf(filepath=p1, export_format='GLB', use_selection=True)
print('plain glb bytes:',os.path.getsize(p1))
try:
    p2=os.path.join(tmp,'g_draco.glb')
    bpy.ops.export_scene.gltf(filepath=p2, export_format='GLB', use_selection=True, export_draco_mesh_compression_enable=True)
    print('draco glb bytes:',os.path.getsize(p2))
except Exception as e:
    print('draco export failed:',type(e).__name__,str(e)[:200])
