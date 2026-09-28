import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(process.argv[2]);
let removed = 0;
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const tc = prim.getAttribute('TEXCOORD_0');
    if (tc) { prim.setAttribute('TEXCOORD_0', null); removed++; }
  }
}
console.log('removed TEXCOORD_0 from prims:', removed);
await doc.transform(prune({ keepAttributes: false }));
await io.write(process.argv[3], doc);
console.log('wrote', process.argv[3]);
