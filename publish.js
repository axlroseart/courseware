'use strict'

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const chalk = require('chalk')
const doneLog = chalk.bgGreen.white(' JOB DONE ') + ' '
var fs = require('fs')
// 删除目录方法
function deleteall(path) {
	var files = [];
	if(fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function(file) {
			var curPath = path + "/" + file
			if(fs.statSync(curPath).isDirectory()) { // recurse
				deleteall(curPath);
			} else { // delete file
				fs.unlinkSync(curPath)
			}
		})
		fs.rmdirSync(path)
	}
}
// 删除多余文件
deleteall('../intelligentcr/courseware')
let copyConfig = {
  entry: {
    renderer: path.join(__dirname, './publish.js')
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, './dist'),
        to: path.join(__dirname, '../intelligentcr/courseware'),
      }
    ])
  ],
  target: 'node'
}

function moveAction(config) {
  return new Promise(function(resolve, reject) {
    webpack(config, (err, stats) => {
      if (err) reject(err.stack || err)
      else if (stats.hasErrors()) {
        let err = ''

        stats.toString({
          chunks: false,
          colors: true
        })
        .split(/\r?\n/)
        .forEach(line => {
          err += `    ${line}\n`
        })

        reject(err)
      } else {
        resolve(stats.toString({
          chunks: false,
          colors: true
        }))
      }
      console.log('Copy...............................Done')
      console.log(`\n${doneLog}\n`)
    })
  }).catch(
    error => console.log('caught', error)
  )
}

moveAction(copyConfig)
