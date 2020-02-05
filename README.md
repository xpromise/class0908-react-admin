# 硅谷后台管理项目
## git操作
* 项目经理（技术总监）
	* 创建仓库
	* 创建初始化项目
	* 初始化项目提交到仓库中保管

* 开发者
	* 获取仓库代码
		* https
			* 项目经理提供：仓库地址 和 用户名/密码
		* ssh
			* 项目经理提供：仓库地址
			* 开发者提供：ssh pub（公钥）
		* git clone 仓库地址
	* 选择分支
		* 项目经理帮你创建xxx分支
			* git fetch origin xxx:xxx 拉取远程分支xxx到本地分支xxx上
			* git checkout xxx 切换到xxx分支
			* 进行开发
		* 项目经理没有帮你创建
			* git checkout -b xxx 创建并切换到xxx分支（将当前分支内容复制到xxx分支上）
			* 进行开发
	* 进行开发
		* 本地版本控制
			* git add .
			* git commit -m 'xxx'
		* 提交到远程仓库
			* git push origin xxx
			* 有可能提交失败
				* 网络问题 （等等试试）
				* 本地没有进行版本控制 
				* 远程仓库有更新 git pull origin xxx 、

## Login组件
* 静态组件
* 动态组件
	* 表单校验
		* 首先组件需要得到form属性： 
			* Form.create()(Login)
			* 高阶组件：给被包装组件传递form属性	
			* form: getFieldDecorator/resetFields/validateFields...			
		* getFieldDecorator('username', { rules: [ { required: true, message: 'xxx' } ] })(<Input />) 一般用于简单表单校验规则（只有一条规则）
		* getFieldDecorator('username', { rules: [ { validator: this.validator } ] })(<Input />)  一般用于复杂表单校验规则（有多条校验规则）
	* 登录功能
		* 解决跨域：服务器代理
			* 工作原理：
				* 客户端发送请求到代理服务器(3000),由代理服务器转发请求到目标服务器上
				* 目标服务器将响应给代理服务器，代理服务器将响应内容转发给客户端
				* 客户端和代理服务器符合同源策略，没有跨域问题。 代理服务器和目标服务器又不存在跨域问题。		
			* 使用
				* 在 package.json 加上 proxy: "目标服务器地址"	
				* 修改package.json, 要重启项目


## 登录功能
1. 表单校验并收集表单数据
* 首先组件需要得到form属性：
	* 通过高阶组件Form.create()(Component)
	* 给 Component 传递form属性
* form.validateFields((err, values) => {})  表单校验并收集表单数据
2. 发送请求，请求登录
* 登录成功，跳转页面，保存用户数据
	* redux（内存） / localStorage（持久化）
	* this.props.history.replace('/')
* 登录失败，提示错误并清空表单数据
	* form.resetFields(['password'])

## axios拦截器
* 作用：拦截请求/响应（在请求之前/响应之后做一些公共的处理）
* 执行流程：请求拦截器 --> 发送请求 --> 响应拦截器 --> then/catch
* 请求拦截器：
	* 添加公共的请求头（authorization: Bearer token）
	* 处理请求参数
		* axios默认post请求的content-type是application/json。
		* 如果通过postman测试发现post请求需要使用application/x-www-form-urlencoded，就需要修改
* 响应拦截器：
	* 返回统一的错误 / 统一处理错误

## 登录检查
* 读取用户数据
	* 从redux中读取
	* 什么时候从localStorage读取呢？reducer函数初始化时从localStorage读取
* 检查用户是否登录过
	* 如果登录过，访问login页面，就跳转到home页面。其他页面不变
	* 如果没有登录过，访问home页面，就跳转到login页面。login页面不变
* 使用：Login / Basic-Layout

## 全屏
* screenfull
* 在componentDidMount绑定onchange事件，在componentWillUnmount解绑事件
* screenfull.toggle()切换全屏

## 国际化
* 自己定义的文字内容的国际化
	* react-intl
	```
		// 最外部包裹一层组件，作用：给子组件提供语言包
		<IntlProvider
			locale={language} // 选择语言
			messages={isEn ? en : zhCN} // 选择语言包
		>
		</IntlProvider>

		// 子组件使用语言包
		<FormattedMessage id={xxx} />

		// 特殊情况：Modal（不属于IntlProvider的子组件）
		@injectIntl // 高阶组件，给子组件传递 intl 属性
		this.props.intl.formatMessage({ id: 'logout' })
	```
* UI组件库(antd)定义文字内容的国际化
	```
		// 引入antd的语言包
		import zh_CN from 'antd/es/locale/zh_CN';
		import en_US from 'antd/es/locale/en_US';

		// 最外部包裹一层组件，作用：给子组件提供语言包
		<ConfigProvider 
			locale={isEn ? en_US : zh_CN} // 语言包
		>
		</ConfigProvider>
	```