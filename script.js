/**
 * 3D 手機展示平台主要程式邏輯
 * 
 * 實作 3D 場景管理、模型載入和使用者互動控制
 */

// 場景相關物件
let scene, camera, renderer;
let phoneModel;
let rotationSpeed = 0.01;
let autoRotate = true;
let currentPhone = 'phone1';
let loader;
let loadingStatus;

/**
 * 初始化 Three.js 場景與必要組件
 * 包含場景、相機、渲染器設定及事件監聽器綁定
 */
function init() {
    loadingStatus = document.getElementById('loading-status');
    
    // 場景初始化與基本設定
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaeaea);
    
    // 設定透視相機
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // 建立 WebGL 渲染器
    initRenderer();
    
    // 設定場景光源
    setupLights();
    
    // 初始化模型載入器
    loader = new GLTFLoader();
    
    // 載入預設手機模型
    loadPhoneModel(currentPhone);
    
    // 註冊事件監聽器
    window.addEventListener('resize', onWindowResize);
    
    // 開始動畫循環
    animate();
    
    // 初始化自動旋轉狀態
    initAutoRotate();
}

/**
 * 初始化 WebGL 渲染器
 * 設定抗鋸齒與容器尺寸
 */
function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    const displayContainer = document.getElementById('phone-display');
    const containerWidth = displayContainer.clientWidth;
    renderer.setSize(containerWidth, 400);
    displayContainer.appendChild(renderer.domElement);
}

/**
 * 設定場景光源
 * 包含環境光與定向光源
 */
function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
}

/**
 * 載入指定的手機 3D 模型
 * @param {string} phoneType - 手機型號識別碼
 */
function loadPhoneModel(phoneType) {
    try {
        loadingStatus.style.display = 'block';
        
        // 清除目前的模型
        if (phoneModel) {
            scene.remove(phoneModel);
        }
        
        const modelPaths = {
            phone1: 'models/iphone_16_pro_max.glb',
            phone2: 'models/samsung_galaxy_s22_ultra.glb',
            phone3: 'models/Samsung_Galaxy_Z_Flip_3.glb'
        };
        
        const modelPath = modelPaths[phoneType];
        if (!modelPath) {
            throw new Error('無效的手機型號');
        }
        
        loader.load(
            modelPath,
            (gltf) => {
                phoneModel = gltf.scene;
                setupPhoneModel();
                loadingStatus.style.display = 'none';
            },
            (xhr) => {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                document.querySelector('.loading-text').textContent = `載入中...${percent}%`;
            },
            (error) => {
                handleModelLoadError(error);
            }
        );
    } catch (error) {
        handleModelLoadError(error);
    }
}

/**
 * 設定載入的手機模型
 * 調整比例與位置
 */
function setupPhoneModel() {
    phoneModel.scale.set(1.5, 1.5, 1.5);
    phoneModel.position.set(0, 0, 0);
    scene.add(phoneModel);
}

/**
 * 處理模型載入錯誤
 * @param {Error} error - 錯誤物件
 */
function handleModelLoadError(error) {
    console.error('模型載入錯誤:', error);
    loadingStatus.style.display = 'none';
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = '載入模型時發生錯誤，請重新整理頁面或稍後再試。';
    document.getElementById('phone-display').appendChild(errorMessage);
}

/**
 * 處理視窗尺寸變更
 * 更新相機比例與渲染器尺寸
 */
function onWindowResize() {
    const displayContainer = document.getElementById('phone-display');
    const containerWidth = displayContainer.clientWidth;
    camera.aspect = containerWidth / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(containerWidth, 400);
}

/**
 * 動畫循環函式
 * 處理自動旋轉和場景渲染
 */
function animate() {
    requestAnimationFrame(animate);
    
    if (autoRotate && phoneModel) {
        phoneModel.rotation.y += rotationSpeed;
    }
    
    renderer.render(scene, camera);
}

/**
 * 初始化自動旋轉按鈕狀態
 */
function initAutoRotate() {
    const autoRotateBtn = document.getElementById('auto-rotate');
    autoRotateBtn.classList.add('active');
}

// 事件監聽器綁定
document.getElementById('rotate-left').addEventListener('click', () => {
    if (phoneModel) {
        phoneModel.rotation.y -= 0.3;
    }
});

document.getElementById('rotate-right').addEventListener('click', () => {
    if (phoneModel) {
        phoneModel.rotation.y += 0.3;
    }
});

document.getElementById('auto-rotate').addEventListener('click', function() {
    autoRotate = !autoRotate;
    this.classList.toggle('active');
});

// 手機選擇按鈕事件處理
const phoneButtons = document.querySelectorAll('.phone-btn');
phoneButtons.forEach(button => {
    button.addEventListener('click', function() {
        updatePhoneSelection(this);
    });
});

/**
 * 更新選擇的手機型號
 * @param {HTMLElement} button - 被點擊的按鈕元素
 */
function updatePhoneSelection(button) {
    // 更新按鈕狀態
    phoneButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // 更新手機資訊顯示
    const phoneId = button.getAttribute('data-phone');
    const phoneDetails = document.querySelectorAll('.phone-details');
    phoneDetails.forEach(detail => detail.classList.remove('active'));
    document.getElementById(phoneId).classList.add('active');
    
    // 載入對應的手機模型
    currentPhone = phoneId;
    loadPhoneModel(phoneId);
}

// 頁面載入完成後初始化
window.onload = init;