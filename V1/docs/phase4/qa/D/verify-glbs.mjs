import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const files = process.argv.slice(2);
if (!files.length) {
  files.push(
    '/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1/public/models/case.opt.glb',
    '/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1/public/models/glasses.opt.glb',
  );
}

async function loadOne(file) {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const buf = fs.readFileSync(file);
  // slice to exact ArrayBuffer (avoid pool offset issues)
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const gltf = await loader.parseAsync(ab, path.dirname(file) + '/');
  const scene = gltf.scene;
  const nodeNames = [];
  scene.traverse((o) => { if (o.name) nodeNames.push(`${o.type}:${o.name}`); });

  // morph targets
  const morphs = [];
  scene.traverse((o) => {
    if (o.isMesh && o.morphTargetDictionary) {
      morphs.push(`${o.name}: [${Object.keys(o.morphTargetDictionary).join(', ')}] influences=[${(o.morphTargetInfluences || []).join(', ')}]`);
    }
  });

  // tri counts
  let tris = 0;
  scene.traverse((o) => {
    if (o.isMesh) {
      const g = o.geometry;
      const idx = g.getIndex();
      const pos = g.getAttribute('position');
      const morphPos = g.morphAttributes && g.morphAttributes.position ? g.morphAttributes.position.length : 0;
      const t = idx ? idx.count / 3 : pos.count / 3;
      tris += t;
      console.log(`  mesh ${o.name}: tris=${Math.round(t)} verts=${pos.count} morphPosCount=${morphPos} mat=${Array.isArray(o.material) ? o.material.map(m=>m.name).join('|') : o.material?.name}`);
    }
  });

  const bbox = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3(); bbox.getSize(size);
  const center = new THREE.Vector3(); bbox.getCenter(center);
  console.log(`FILE: ${file} (${buf.length} bytes)`);
  console.log(`  nodes: ${nodeNames.join(', ')}`);
  console.log(`  morphs: ${morphs.length ? morphs.join(' ; ') : '(none)'}`);
  console.log(`  total tris: ${Math.round(tris)}`);
  console.log(`  bbox min (m): ${bbox.min.toArray().map(v=>v.toFixed(5)).join(', ')}`);
  console.log(`  bbox max (m): ${bbox.max.toArray().map(v=>v.toFixed(5)).join(', ')}`);
  console.log(`  bbox size mm: ${(size.x*1000).toFixed(2)} x ${(size.y*1000).toFixed(2)} x ${(size.z*1000).toFixed(2)}`);
  console.log(`  bbox center mm: ${(center.x*1000).toFixed(2)}, ${(center.y*1000).toFixed(2)}, ${(center.z*1000).toFixed(2)}`);
  console.log('');
}

for (const f of files) await loadOne(f);
