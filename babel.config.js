// 项目发布需要用到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV == 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  'presets': [
    '@vue/app'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    ...prodPlugins
  ]
}
