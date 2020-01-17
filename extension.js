const Main = imports.ui.main;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const St = imports.gi.St;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

const Lang = imports.lang;
const Util = imports.misc.util;
let loop = GLib.MainLoop.new(null, false);

const PATH = '/gty/.local/share/gnome-shell/extensions/turnable-menu@tylerbarabas.github.com'

const TurnableMenu_Indicator = new Lang.Class({
  Name: 'TurnableMenu.indicator',
  Extends: PanelMenu.Button,
  _init: function(){
    this.parent(0.0);

    this.isBuilding = false

    let button = new St.Bin({
      style_class: 'panel-button',
      reactive: true,
      can_focus: true,
      x_fill: true,
      y_fill: false,
      track_hover: true
    });

    let icon = new St.Icon({ style_class: 'turnable-icon' });
    button.set_child(icon);
    this.actor.add_child(button);

    let menuItem1 = new PopupMenu.PopupMenuItem('Build Locally');
    menuItem1.actor.connect('button-press-event', function(){
      if (!this.isBuilding && !this.isDeploying) {
        this.isBuilding = true

        Main.notify('Building Turnable...', 'Take a big sip of coffee and stretch.') 
        execCommand([`${PATH}/scripts/build.sh`]).then(function (stdout){
          stdout.split('\n').map(line=>log(line))
          this.isBuilding = false
          let success = stdout.indexOf('success') !== -1
          if (success) Main.notify('Build finished!', 'Ready to deploy or serve.')
          else Main.notify('Build failed.')
        });
      } else {
        Main.notify('Can\'t start a build right now.', 'I\'m busy with another process')
      }
    });

    let menuItem2 = new PopupMenu.PopupMenuItem('Deploy to Staging');
    menuItem2.actor.connect('button-press-event', function(){
      if (!this.isBuilding && !this.isDeploying) {
        this.isDeploying = true

        execCommand([`${PATH}/scripts/deploy-to-staging.sh`]).then(function (stdout){
          stdout.split('\n').map(line=>log(line))
          this.isDeploying = false
          let success = stdout.indexOf('success') !== -1
          if (success) Main.notify('Deployment to Staging successful.', 'Go view it at https://app-dev.myturnable.com')
          else Main.notify('Deployment to Staging failed.')
        });
      } else {
        Main.notify('Can\'t deploy right now.', 'I\'m busy with another process.')
      }
    });

    let menuItem3 = new PopupMenu.PopupMenuItem('Deploy to Production');
    menuItem3.actor.connect('button-press-event', function(){
      if (!this.isBuilding && !this.isDeploying) {
        this.isDeploying = true

        execCommand([`${PATH}/scripts/deploy-to-production.sh`]).then(function (stdout){
          stdout.split('\n').map(line=>log(line))
          this.isDeploying = false
          let success = stdout.indexOf('success') !== -1
          if (success) Main.notify('Deployment to Production successful.', 'Go view it at https://app.myturnable.com')
          else Main.notify('Deployment to Production failed.')
        });
      } else {
        Main.notify('Can\'t deploy right now.', 'I\'m busy with another process.')
      }
    });

    this.menu.addMenuItem(menuItem1);
    this.menu.addMenuItem(menuItem2);
    this.menu.addMenuItem(menuItem3);
  }
});


async function execCommand(argv, cancellable=null) {
    try {
        // There is also a reusable Gio.SubprocessLauncher class available
        let proc = new Gio.Subprocess({
            argv: argv,
            // There are also other types of flags for merging stdout/stderr,
            // redirecting to /dev/null or inheriting the parent's pipes
            flags: Gio.SubprocessFlags.STDOUT_PIPE
        });
        
        // Classes that implement GInitable must be initialized before use, but
        // an alternative in this case is to use Gio.Subprocess.new(argv, flags)
        //
        // If the class implements GAsyncInitable then Class.new_async() could
        // also be used and awaited in a Promise.
        proc.init(null);

        let stdout = await new Promise((resolve, reject) => {
            // communicate_utf8() returns a string, communicate() returns a
            // a GLib.Bytes and there are "headless" functions available as well
            proc.communicate_utf8_async(null, cancellable, (proc, res) => {
                let ok, stdout, stderr;

                try {
                    [ok, stdout, stderr] = proc.communicate_utf8_finish(res);
                    resolve(stdout);
                } catch (e) {
                    reject(e);
                }
            });
        });

        return stdout;
    } catch (e) {
        logError(e);
    }
}

let _indicator

function init() {
};

function enable() {
  _indicator =  new TurnableMenu_Indicator();

  Main.panel._addToPanelBox('TurnableMenu', _indicator, 1, Main.panel._rightBox);
};

function disable(){
  _indicator.destroy();
};
