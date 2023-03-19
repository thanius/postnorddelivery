const calendarName = config.calendarName;
const calendarDescription = config.description;
const calendarColor = config.color;

function setup() { 
  // Check if we want local time on the calendar (default GMT)
  var timeZone = getTimeZone();

  // Find calendar by configured name
  var cal = CalendarApp.getCalendarsByName(calendarName);
  
  // Create calendar if it doesn't exist
  if(cal == '') {
    Logger.log('Calendar "%s" does not exist, creating...', calendarName);
    cal = CalendarApp.createCalendar(calendarName, {
      color: calendarColor,
      timeZone: timeZone
    });

    // Workaround since summary doesn't work as option in createCalendar()
    cal.setDescription(calendarDescription);

    Logger.log('Created the calendar "%s", with the ID "%s".', cal.getName(), cal.getId());
  } else {
    Logger.log('Found calendar "%s" with the ID "%s".', cal[0].getName(), cal[0].getId());
  }
}

function eventExists(calendar, date) {

  // Get all events for the date
  let events = calendar.getEvents(new Date(date), new Date(date + ' 23:59:59.999'));

  // Loop through all events and see if any of them has our defined event title
  for (var i = 0; i < events.length; i++) {
    let event = events[i];
    if(event.getTitle() == config.eventDescription) {
      Logger.log('An event called "%s" already exists: %s → %s.\nSkipping adding entry on date %s.', event.getTitle(), event.getStartTime(), event.getEndTime(), date);
      return true;
    } else {
      return false;        
    }
  }
}

function createEvents() {
  // Get upcoming delivery dates
  const url = config.apiUrl + config.postalCode;
  const data = getData(url);
  const dates = data.dates;
  const location = data.location;

  // Get calendar
  const cal = CalendarApp.getCalendarsByName(calendarName)[0];
  const calName  = cal.getName();
    
  // Loop through the delivery dates
  for (const property in dates) {
    var date = dates[property];
    Logger.log('Adding entry for delivery on date %s in calendar "%s".', date, calName);

    // Create event if it doesn't already exist for the date
    if(!eventExists(cal, date)) {
      var event;

      // Add the entry at configured time and create notification
      dateTime = new Date(date).toDateString("yyyy-mm-dd") + ' ' + config.time;
      event = cal.createEvent(config.eventDescription, new Date(dateTime), new Date(dateTime), {
        location: location
      });
      event.addPopupReminder(0);

      Logger.log('Created event "%s" with id "%s".', event.getTitle(), event.getId());
    }
  }
}
