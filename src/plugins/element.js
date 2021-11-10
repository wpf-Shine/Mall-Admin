import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, MessageBox, Container, Header, Aside, Main,
  Row, Col, Dropdown, DropdownMenu, DropdownItem, Menu, Submenu, MenuItem, Dialog,
  Breadcrumb, BreadcrumbItem, Card, Table, TableColumn, Switch, Tooltip, Pagination,
  Tag, Tree
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Dialog)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Tag)
Vue.use(Tree)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
