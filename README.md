# [Autom_Blog](http://www.it120cc.com/)

> 此为账本webapp 前端项目

## 更新说明

更新说明文档放在[release-note](docs/release-note.md)下，上线测试服前更新，方便测试人员梳理测试点，以及运维人员执行更新操作。

## 快速开始

### 开发环境
 - NodeJS >=5
 - npm >=3
 - yarn >=0.24

### yarn基本命令
```
yarn                    // 相当于npm install
yarn add <module>       // 相当于npm install <module> --save
yarn add <module> --dev // 相当于npm install <module> --save-dev
yarn remove <module>    // 相当于npm uninstall <module> --save
```

### 启动项目
```
git clone <ssh:remote>
cd zwebapp
npm install
npm start
```

### 发布项目
```
// 前3步为初始化配置，再次发布无须重复操作
git clone <ssh:remote>
cd build
git checkout dist-dev

// 正常发布到开发服的流程
cd ..
npm run build
cd build
git add -A
git commit -am 'deploy based on <branch> <commit-hash>'
git push origin dist-dev

// 登录开发服，拉取代码更新
ssh root@<server-ip>
cd <project-path>
git pull
```
