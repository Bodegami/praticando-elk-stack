'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = pluginCli;
var utils = require('requirefrom')('src/utils');
var fromRoot = utils('fromRoot');
var settingParser = require('./setting_parser');
var installer = require('./plugin_installer');
var remover = require('./plugin_remover');
var lister = require('./plugin_lister');
var pluginLogger = require('./plugin_logger');

function pluginCli(program) {
  function processCommand(command, options) {
    var settings = undefined;
    try {
      settings = settingParser(command).parse();
    } catch (ex) {
      //The logger has not yet been initialized.
      console.error(ex.message);
      process.exit(64); // eslint-disable-line no-process-exit
    }

    var logger = pluginLogger(settings);

    switch (settings.action) {
      case 'install':
        installer.install(settings, logger);
        break;
      case 'remove':
        remover.remove(settings, logger);
        break;
      case 'list':
        lister.list(settings, logger);
        break;
    }
  }

  program.command('plugin').option('-i, --install <org>/<plugin>/<version>', 'The plugin to install').option('-r, --remove <plugin>', 'The plugin to remove').option('-l, --list', 'List installed plugins').option('-q, --quiet', 'Disable all process messaging except errors').option('-s, --silent', 'Disable all process messaging').option('-u, --url <url>', 'Specify download url').option('-c, --config <path>', 'Path to the config file', fromRoot('config/kibana.yml')).option('-t, --timeout <duration>', 'Length of time before failing; 0 for never fail', settingParser.parseMilliseconds).option('-d, --plugin-dir <path>', 'The path to the directory where plugins are stored', fromRoot('installedPlugins')).description('Maintain Plugins', '\n  Common examples:\n    -i username/sample\n      attempts to download the latest version from the following url:\n        https://download.elastic.co/username/sample/sample-latest.tar.gz\n\n    -i username/sample/v1.1.1\n      attempts to download version v1.1.1 from the following url:\n        https://download.elastic.co/username/sample/sample-v1.1.1.tar.gz\n\n    -i sample -u http://www.example.com/other_name.tar.gz\n      attempts to download from the specified url,\n      and installs the plugin found at that url as "sample"\n').action(processCommand);
}

;
module.exports = exports['default'];
