# Known Issues & Bugs

- [ ]GENERAL: dark theme and i18n
- [ ]GENERAL: input length limit
- [ ]同名的item（如beef）创建失败没有显示错误提示
- [ ]数据库不允许item名字相同 -> 应该改为允许相同，只要id unique即可
- [ ]有时候item edit会失败，错误未知，可能和上一条有关
- [ ]SwipeableItem 仅用于触屏/mobile用户组件，对于web用户的行为没有cover
- [ ]底部Nav切换的时候，inventory在加载出来前会闪一下（无items）







- [x]item添加失败，无报错，当前状态edit和delete都没问题 -> 用onBlur替代原本的检测容器位置触发add事件
- [x]触屏模式新增item时，name设置后，date picker点击失败（name和expiredDate设置相互冲突）-> 常见的触屏时间冲突:
`移动端日期选择器闪退问题概述
问题现象
在移动端（iOS/Android）点击 HTML5 <input type="date"> 的日历图标时，日期选择器会短暂显示后立即消失，无法正常选择日期。
根本原因
焦点管理冲突：移动端浏览器的日期选择器与页面焦点管理机制产生冲突
事件冒泡干扰：点击事件可能冒泡到父元素，触发 onBlur 或其他焦点转移逻辑
触摸事件处理：移动端的触摸事件与鼠标事件处理机制不同，可能导致焦点丢失
浏览器实现差异：不同移动端浏览器对日期选择器的实现存在差异
常见触发场景
在 React 组件中使用 onBlur 处理保存逻辑
父容器有触摸事件监听器
页面有其他自动聚焦的元素
使用了复杂的焦点管理逻辑
解决思路
阻止事件冒泡：使用 stopPropagation() 和 preventDefault()
延迟处理：给日期选择器足够的显示时间
状态标记：通过状态控制避免冲突
降级方案：移动端使用文本输入或第三方组件
技术要点
移动端事件处理机制
React 焦点管理
浏览器兼容性处理
用户体验优化
这个问题在移动端 Web 开发中非常常见，需要特别注意事件处理和焦点管理的细节。`