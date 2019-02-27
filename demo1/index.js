class Demo {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.render = this.render.bind(this);
    this.init();
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initRenderer();

    const loader = new THREE.OBJLoader();
    loader.load('../source/model/cage.obj', (obj) => {
      this.obj = obj;
      //获取模型尺寸
      const b = new THREE.Box3();
      b.expandByObject(obj);

      //模型缩放
      const s = Math.min(
        1 / (b.max.x),
        1 / (b.max.y),
        1 / (b.max.z)
      );
      obj.scale.set(s, s, s);

      //添加贴图
      obj.traverse(( child ) => {
        if ( child instanceof THREE.Mesh ) {
          child.material.map = new THREE.TextureLoader().load('../source/img/wood.jpeg');
        }
      });

      this.scene.add(obj);
    });
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.set(1, 1, 1);
    this.scene.add(this.camera);

    this.controls = new THREE.OrbitControls(this.camera);

    // this.cameraHelper = new THREE.CameraHelper(this.camera);
    this.scene.add(this.camera);
  }

  initLight() {
    this.ambientLight = new THREE.AmbientLight( 0x404040 );
    this.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
    this.pointLight.position.set(2, 0, 2);
    this.scene.add(this.pointLight);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(this.width, this.height);

    document.body.appendChild( this.renderer.domElement );
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    this.controls.update();

    if (this.obj) {
      this.obj.rotation.y += .005;
    }

    requestAnimationFrame(this.render);
  }
}