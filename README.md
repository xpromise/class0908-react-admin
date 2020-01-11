# 硅谷后台管理项目

## git 操作

- 项目经理（技术总监）
  _ 创建仓库
  _ 创建初始化项目 \* 初始化项目提交到仓库中保管

- 开发者
  _ 获取仓库代码
  _ https
  _ 项目经理提供：仓库地址 和 用户名/密码
  _ ssh
  _ 项目经理提供：仓库地址
  _ 开发者提供：ssh pub（公钥）
  _ git clone 仓库地址
  _ 选择分支
  _ 项目经理帮你创建 xxx 分支
  _ git fetch origin xxx:xxx 拉取远程分支 xxx 到本地分支 xxx 上
  _ git checkout xxx 切换到 xxx 分支
  _ 进行开发
  _ 项目经理没有帮你创建
  _ git checkout -b xxx 创建并切换到 xxx 分支（将当前分支内容复制到 xxx 分支上）
  _ 进行开发
  _ 进行开发
  _ 本地版本控制
  _ git add .
  _ git commit -m 'xxx'
  _ 提交到远程仓库
  _ git push origin xxx
  _ 有可能提交失败
  _ 网络问题 （等等试试）
  _ 本地没有进行版本控制 \* 远程仓库有更新 git pull origin xxx
