// 建立 Three.js 場景、相機和渲染器
let scene, camera, renderer;
let phoneModel;
let rotationSpeed = 0.01;
let autoRotate = true;
let currentPhone = 'phone1';
let loader; // GLTF 載入器

// 初始化 Three.js 場景
function init() {
    // 建立場景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaeaea);

    // 建立相機
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 建立渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, 400);
    document.getElementById('phone-display').appendChild(renderer.domElement);

    // 加入燈光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 初始化 GLTF 載入器
    loader = new THREE.GLTFLoader();

    // 載入預設手機模型
    loadPhoneModel(currentPhone);

    // 視窗大小改變時的處理
    window.addEventListener('resize', onWindowResize);
    
    // 開始動畫迴圈
    animate();
}

// 載入手機模型
function loadPhoneModel(phoneType) {
    // 清除目前的模型
    if (phoneModel) {
        scene.remove(phoneModel);
    }
    
    let modelPath;
    
    // 依照手機類型選擇對應的模型檔案
    switch(phoneType) {
        case 'phone1':
            modelPath = 'models/iphone_16_pro_max.glb';
            break;
        case 'phone2':
            modelPath = 'models/samsung_galaxy_s22_ultra.glb';
            break;
        case 'phone3':
            modelPath = 'models/Samsung_Galaxy_Z_Flip_3.glb';
            break;
    }
    
    // 載入 GLB 模型
    loader.load(
        modelPath,
        function(gltf) {
            phoneModel = gltf.scene;
            
            // 調整模型大小和位置
            phoneModel.scale.set(1.5, 1.5, 1.5);
            phoneModel.position.set(0, 0, 0);
            
            // 加入到場景
            scene.add(phoneModel);
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% 載入中');
        },
        function(error) {
            console.error('模型載入錯誤:', error);
        }
    );
}

// 視窗大小改變處理
function onWindowResize() {
    camera.aspect = window.innerWidth / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 400);
}

// 動畫迴圈
function animate() {
    requestAnimationFrame(animate);
    
    if (autoRotate && phoneModel) {
        phoneModel.rotation.y += rotationSpeed;
    }
    
    renderer.render(scene, camera);
}

// 手動旋轉控制
document.getElementById('rotate-left').addEventListener('click', function() {
    if (phoneModel) {
        phoneModel.rotation.y -= 0.3;
    }
});

document.getElementById('rotate-right').addEventListener('click', function() {
    if (phoneModel) {
        phoneModel.rotation.y += 0.3;
    }
});

// 選擇不同手機
const phoneButtons = document.querySelectorAll('.phone-btn');
phoneButtons.forEach(button => {
    button.addEventListener('click', function() {
        // 更新按鈕狀態
        phoneButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // 更新顯示的手機資訊
        const phoneId = this.getAttribute('data-phone');
        const phoneDetails = document.querySelectorAll('.phone-details');
        phoneDetails.forEach(detail => {
            detail.classList.remove('active');
        });
        document.getElementById(phoneId).classList.add('active');
        
        // 載入對應的手機模型
        currentPhone = phoneId;
        loadPhoneModel(phoneId);
    });
});

// 初始化
window.onload = init;