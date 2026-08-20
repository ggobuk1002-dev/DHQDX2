import re
with open('js/threeViewer.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Remove test cube
code = re.sub(r'const geometry = new THREE\.BoxGeometry.*?this\.scene\.add\(cube\);', '', code, flags=re.DOTALL)

# Robust centering and material override
robust_logic = """
        this.model = gltf.scene;
        
        // Ensure materials are visible
        this.model.traverse((child) => {
          if (child.isMesh) {
            // Recompute normals just in case
            child.geometry.computeVertexNormals();
            if (child.material) {
              child.material.metalness = 0.1;
              child.material.roughness = 0.7;
              child.material.color = new THREE.Color(0xd4af37); // Base gold color
              child.material.emissive = new THREE.Color(0x110d00); // Slight glow
              child.material.needsUpdate = true;
            }
          }
        });

        // Robust sizing
        const box = new THREE.Box3().setFromObject(this.model);
        if (box.isEmpty()) {
            // Fallback scale if empty
            this.model.scale.set(1, 1, 1);
        } else {
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = maxDim > 0 ? (1.5 / maxDim) : 1;
            this.model.scale.set(scale, scale, scale);
        }
        
        // Robust centering
        const scaledBox = new THREE.Box3().setFromObject(this.model);
        if (!scaledBox.isEmpty()) {
            const center = scaledBox.getCenter(new THREE.Vector3());
            this.model.position.x -= center.x;
            this.model.position.y -= center.y;
            this.model.position.z -= center.z;
        }

        this.scene.add(this.model);
"""

# Replace the existing logic
code = re.sub(r'this\.model = gltf\.scene;.*?this\.scene\.add\(this\.model\);', robust_logic.strip(), code, flags=re.DOTALL)

with open('js/threeViewer.js', 'w', encoding='utf-8') as f:
    f.write(code)
print('Applied robust 3D model fixes')
