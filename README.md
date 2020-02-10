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

## 分类管理
* redux操作流程
	* 定义api - 发送请求的方法
	* actions - 因为要发送请求，所以定义异步action（异步action一般还需要定义一个同步action）
	* action-types 常量
	* reducers
		* 如果数据是一个不同的新数据，就要定义一个新的reducer函数	
	* 通过connect高阶组件向UI组件传递redux的状态数据，更新状态数据的方法
		* @connect((state) => ({categories: state.categories}), { xxx })
	* 使用： this.props.xxx

## 分页管理
* 前台分页
	* 分类管理
	* 一次性将所有数据全部请求回来，再进行分页展示
	* 问题：如果数据比较多，那么速度就很慢
* 后台分页
	* 商品管理
	* 每次请求只请求当前一页的数据
	* 优点：请求的数据少，速度快~
	* 缺点：切换分页时，需要频繁的发送请求

* 问题：401错误，你没权限访问。
	* 一定是token出错了~
	* 解决：
		* 通过检查network看相应请求的request headers中有没有authorization，以及值是否正确
		* 如果没有，那就去请求拦截器中检查原因
		* 如果有还是报错，说明token过期了（服务器token7天过期的）
			* 在响应拦截器失败回调中完成
			* 清除本地的用户数据，重新登录一次。

## 错误
* Uncaught Error: [React Intl] An `id` must be provided to format a message.
	* 分析：从关键字入手：React Intl / format a message
	* 一定是国际化功能出现问题，并且是react-intl国际化问题
	* <FormattedMessage id={xxx} /> 提供的id出了问题

## 修改商品
* 如何判断页面变化由什么控制？
	* 如果只有页面变化，没有url变化，就是通过控制状态（组件自己的state / redux）更新的
	* 如果既有页面变化，又有url变化，就是通过控制路由更新的
* 路由更新怎么设置呢？
	* 统一都在 config/routes 配置路由表
	* 最终会在 App 组件中遍历出 Route 加载
* 路由组件通信
	* Product --> ProductForm..
	* 可以通过 history.push('/product/update/xxx', 数据)	
	* 组件内部通过 location.state 获取

## 权限管理
* 设置用户权限
	* 权限管理组件完成
	* 创建角色用户，并设置角色拥有指定的权限
	* 创建用户账户同时绑定角色，所以便拥有的相应权限

* 当用户登录时，使其设置的权限生效 ***
	* 对左侧导航进行权限管理 (有权限就能导航访问)
		* 获取到menus(所有菜单)，获取用户权限roleMenus(redux中user.user.menus)
		* 通过处理，让menus中只包含用户权限roleMenus中允许访问的菜单
		* 特殊：深度克隆
	* 对路由进行权限管理 (用户可能直接输入网址，此时也得进行权限管理)
		* 获取到routes(所有路由)，获取用户权限roleMenus(redux中user.user.menus)
		* 通过处理，让routes中只包含用户权限roleMenus中允许访问的菜单
		* 特殊：可能有一个全新菜单对应多个路由地址

## 图形图表
* 使用puppeteer爬取数据
	* class0908仓库 puppeteer
	* 最终得到包含城市数据的 json 文件	
* 在React中使用echarts	
	* echarts-for-react / echarts