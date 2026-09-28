import bpy, os
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for m in list(bpy.data.materials): bpy.data.materials.remove(m)
bpy.ops.wm.obj_import(filepath='/Users/admin/Downloads/Glasses_Mama_WBL/Glasses_Mama_WBL.obj', up_axis='Y', forward_axis='NEGATIVE_Z')
cols=[(1,0,0),(0,1,0),(0,0,1),(1,1,0),(1,0,1),(0,1,1),(1,.5,0),(.5,0,1),(0,.5,1),(1,.5,.5),(.5,1,.5),(.5,.5,1),(1,1,1)]
names=sorted([o.name for o in bpy.context.scene.objects if o.type=='MESH'])
for i,name in enumerate(names):
    ob=bpy.context.scene.objects[name]
    m=bpy.data.materials.new('C_'+name); m.use_nodes=True
    bsdf=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    bsdf.inputs['Base Color'].default_value=(*cols[i%len(cols)],1)
    ob.data.materials.clear(); ob.data.materials.append(m)
    print('COLOR', i, name, [round(c,2) for c in cols[i%len(cols)]])
scene=bpy.context.scene
scene.render.engine='BLENDER_EEVEE'; scene.render.resolution_x=1600; scene.render.resolution_y=900
bg=next(n for n in scene.world.node_tree.nodes if n.type=='BACKGROUND'); bg.inputs['Color'].default_value=(0.08,0.08,0.09,1)
bpy.ops.object.light_add(type='SUN', location=(3,4,5)); bpy.context.active_object.data.energy=5
bpy.ops.object.light_add(type='AREA', location=(-3,2,4)); a=bpy.context.active_object; a.data.energy=400; a.data.size=4
objs=[o for o in scene.objects if o.type=='MESH']
gmin=Vector((1e9,)*3); gmax=Vector((-1e9,)*3)
for ob in objs:
    for c in [ob.matrix_world @ Vector(x) for x in ob.bound_box]:
        gmin.x=min(gmin.x,c.x); gmin.y=min(gmin.y,c.y); gmin.z=min(gmin.z,c.z)
        gmax.x=max(gmax.x,c.x); gmax.y=max(gmax.y,c.y); gmax.z=max(gmax.z,c.z)
center=(gmin+gmax)/2; size=gmax-gmin; D=float(max(size))*1.6
cam_data=bpy.data.cameras.new('Gcam'); cam=bpy.data.objects.new('Gcam',cam_data); scene.collection.objects.link(cam); scene.camera=cam
def aim(loc):
    cam.location=loc; d=center-Vector(loc); cam.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
outdir='/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1/docs/research/screens/G'
views={'color_34':(center.x+D*0.8,center.y-D*0.9,center.z+D*0.55),'color_front':(center.x,center.y+D,center.z+0.05)}
for vn,loc in views.items():
    aim(loc); scene.render.filepath=os.path.join(outdir,'G_'+vn+'.png'); bpy.ops.render.render(write_still=True); print('wrote',vn)
