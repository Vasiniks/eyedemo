"""Inspect native OBJ dims: per-object bboxes, front widths, orientation mapping."""
import bpy, json
from mathutils import Vector

SRC = "/Users/admin/Downloads/Glasses_Mama_WBL/Glasses_Mama_WBL.obj"
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.wm.obj_import(filepath=SRC)  # defaults
print("IMPORT DONE")
for o in sorted(bpy.context.scene.objects, key=lambda o: o.name):
    if o.type != 'MESH':
        continue
    ws = [o.matrix_world @ v.co for v in o.data.vertices]
    mn = (min(p[0] for p in ws), min(p[1] for p in ws), min(p[2] for p in ws))
    mx = (max(p[0] for p in ws), max(p[1] for p in ws), max(p[2] for p in ws))
    sz = tuple(round(mx[i]-mn[i], 4) for i in range(3))
    print(f"OBJ {o.name!r}: n={len(o.data.vertices)} min=({mn[0]:.4f},{mn[1]:.4f},{mn[2]:.4f}) max=({mx[0]:.4f},{mx[1]:.4f},{mx[2]:.4f}) size={sz}")

# global bbox
pts = []
for o in bpy.context.scene.objects:
    if o.type == 'MESH':
        pts += [o.matrix_world @ v.co for v in o.data.vertices]
mn = [min(p[i] for p in pts) for i in range(3)]
mx = [max(p[i] for p in pts) for i in range(3)]
print(f"GLOBAL min={mn} max={mx} size={[round(mx[i]-mn[i],4) for i in range(3)]}")

# lens outer edge (front width proxy)
lens = bpy.context.scene.objects.get('Vert.003')
xs = sorted(abs((lens.matrix_world @ v.co)[0]) for v in lens.data.vertices)
print(f"lens max|x|={xs[-1]:.4f} -> front lens-edge width={2*xs[-1]:.4f}")

# hinge barrel extent
bar = bpy.context.scene.objects.get('\u5186\u67f1')
xs = sorted(abs((bar.matrix_world @ v.co)[0]) for v in bar.data.vertices)
print(f"barrel max|x|={xs[-1]:.4f} -> hinge-to-hinge width={2*xs[-1]:.4f}")

# centroids: lens vs tips along each axis (which axis is depth?)
tips = bpy.context.scene.objects.get('\u5e73\u9762')
def cent(o):
    ws = [o.matrix_world @ v.co for v in o.data.vertices]
    return tuple(sum(p[i] for p in ws)/len(ws) for i in range(3))
print("lens centroid", tuple(round(v,4) for v in cent(lens)))
print("tips centroid", tuple(round(v,4) for v in cent(tips)))
rod = bpy.context.scene.objects.get('\u5186\u67f1.002')
print("rod centroid", tuple(round(v,4) for v in cent(rod)))
jw = bpy.context.scene.objects.get('\u7acb\u65b9\u4f53_\u7acb\u65b9\u4f53.001')
print("hingewire centroid", tuple(round(v,4) for v in cent(jw)))
print("barrel centroid", tuple(round(v,4) for v in cent(bar)))

# import operator defaults
import inspect
print(inspect.signature(bpy.ops.wm.obj_import))
