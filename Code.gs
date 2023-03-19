function install() {
  // Trigger every 2 days
  ScriptApp.newTrigger('execute')
      .timeBased()
      .everyDays(2)
      .create();
}

function uninstall() {
  // Deletes all triggers in the current project.
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function execute() {
  setup();
  createEvents();
}
