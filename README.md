# Tetris+ 🎮

一个功能丰富的俄罗斯方块游戏，使用 React Native 和 Expo 构建，支持 iOS、Android 和 Web 平台。

## 特性 ✨

- **🎯 经典俄罗斯方块玩法** - 7种经典方块（I, O, T, S, Z, J, L）
- **💥 道具系统** - 连击触发特殊道具：
  - 💣 炸弹方块：消除后清除周围 3x3 区域
  - ❄️ 时间冻结：暂停下落 5 秒
  - 🌈 彩虹方块：可以填充任何空缺
  - ⚡ 闪电方块：消除整行
  - ⏰ 时间倒流：减缓下落速度 50%，持续 10 秒

- **🎨 多主题支持**：
  - 霓虹夜城（默认）
  - 像素复古（GameBoy 风格）
  - 极简黑白
  - 自然森林（需解锁）
  - 赛博朋克（需解锁）

- **🏆 完整计分系统** - 基于 Tetris 官方规则，支持连击倍数
- **📊 难度递增** - 随着等级提升，下落速度逐渐加快
- **💾 存档功能** - 使用 AsyncStorage 保存游戏进度
- **🎮 触觉反馈** - 支持震动反馈（使用 expo-haptics）

## 技术栈 🛠️

- **框架**: React Native 0.81.5 + Expo 54
- **语言**: TypeScript 5.9
- **状态管理**: Zustand 5.0
- **动画**: React Native Reanimated 4.2
- **存储**: AsyncStorage

## 项目结构 📁

```
tetris-plus/
├── src/
│   ├── components/       # UI 组件
│   │   ├── blocks/      # 方块组件
│   │   ├── game/        # 游戏组件
│   │   ├── screens/     # 页面组件
│   │   └── ui/          # 通用 UI 组件
│   ├── core/            # 游戏核心逻辑
│   │   ├── Board.ts              # 棋盘管理
│   │   ├── CollisionDetection.ts # 碰撞检测
│   │   ├── GameEngine.ts         # 游戏引擎
│   │   ├── GravitySystem.ts      # 重力系统
│   │   ├── LineClearing.ts       # 消行逻辑
│   │   ├── PowerUpSystem.ts      # 道具系统
│   │   └── RotationSystem.ts     # 旋转系统（SRS）
│   ├── state/           # 状态管理
│   │   ├── store/       # Zustand stores
│   │   └── useGameState.ts
│   ├── types/           # TypeScript 类型定义
│   └── utils/           # 工具函数和常量
├── App.tsx              # 主应用入口
└── package.json
```

## 安装和运行 🚀

### 前置要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
# iOS 模拟器
npm run ios

# Android 模拟器
npm run android

# Web 浏览器
npm run web

# 启动 Expo 开发服务器
npm start
```

然后扫描 Expo Go 应用中的二维码来在移动设备上运行。

## 游戏规则 📖

### 基本操作

- **左/右移动** - 控制方块水平移动
- **软降** - 加速下落（每格 1 分）
- **硬降** - 立即落地（每格 2 分）
- **旋转** - 旋转方块（支持 SRS 旋转系统）

### 计分规则

| 消除行数 | 得分 |
|---------|------|
| 1 行     | 100  |
| 2 行     | 300  |
| 3 行     | 500  |
| 4 行 (Tetris) | 800  |

### 连击系统

- 连续消除可获得额外倍数加成
- 连击 3+ 触发道具生成
- Tetris 必定生成道具

## 开发计划 🔮

- [ ] 添加成就系统
- [ ] 添加每日挑战模式
- [ ] 添加多人对战模式
- [ ] 添加排行榜功能
- [ ] 添加音效和背景音乐
- [ ] 支持自定义方块皮肤

## License

MIT
