import bpy
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for m in list(bpy.data.materials): bpy.data.materials.remove(m)
bpy.ops.wm.obj_import(filepath='/Users/admin/Downloads/Glasses_Mama_WBL/Glasses_Mama_WBL.obj', up_axis='Y', forward_axis='NEGATIVE_Z')
ob=bpy.context.scene.objects.get('円柱.002'); mw=ob.matrix_world
for s in (1,-1):
    pts=[mw@v.co for v in ob.data.vertices if (v.co.x>0)==(s>0)]
    ys=sorted(p.y for p in pts)
    lo=[p for p in pts if p.y<ys[int(len(pts)*0.05)]]
    c=sum(lo,Vector())/len(lo)
    print('arm_minY_end', 'R' if s>0 else 'L', tuple(round(v,4) for v in c), 'n=',len(lo))
# lens thickness: Vert.003 extent along Y (view dir)
l=bpy.context.scene.objects.get('Vert.003')
ys=[(l.matrix_world@v.co).y for v in l.data.vertices]
print('lens Y thickness extent:', round(max(ys)-min(ys),4))
