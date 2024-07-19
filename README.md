# 字幕在线编辑工具

这是一个用于在线编辑视频字幕的工具。它允许用户添加、删除、以及修改字幕，提供了一个直观的界面来简化字幕编辑过程。

## 功能特点

- **添加字幕**：用户可以在视频的任意时间点插入新的字幕。
- **删除字幕**：支持删除单个字幕或一次性删除所有字幕。
- **编辑字幕**：支持对字幕文本进行编辑，包括修改字幕的开始和结束时间。
- **高亮显示**：编辑中的字幕会被高亮显示，方便用户识别。

## 开始使用

以下指南将帮助你在本地机器上安装和运行项目，用于开发和测试目的。

### 先决条件

在开始之前，你需要安装以下软件：

- Node.js
- npm
- nvm (可选), 推荐使用 nvm 来管理 Node.js 版本。

# 检查 Node.js 安装
node --version

# 检查 npm 安装
npm --version


## 安装
### 1.克隆仓库

```bash
git clone https://github.com/qianniucity/video-sub2.git
cd video-sub2
```
### 2.安装项目依赖
```bash
bun install
```
注意：如果你使用的是 nvm，请确保你的 Node.js 版本正确。
```bash
nvm install
```
### 3.启动开发服务器
```bash
bun dev
```
### 4.打开浏览器
在浏览器中打开 http://localhost:3000/ 查看项目。


## 技术栈
- React - 前端框架
- Node.js - 服务器环境
- jotai - 状态管理
- wavesurfer.js - 音频可视化