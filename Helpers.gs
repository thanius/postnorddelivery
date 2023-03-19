function convertToISODate(dateString) {
  const months = {
    "januari": "01",
    "februari": "02",
    "mars": "03",
    "april": "04",
    "maj": "05",
    "juni": "06",
    "juli": "07",
    "augusti": "08",
    "september": "09",
    "oktober": "10",
    "november": "11",
    "december": "12",
  };

  const regex = /(\d{1,2})\s+(\w+)\s*,\s*(\d{4})/;
  const matches = regex.exec(dateString);

  const day = matches[1];
  const month = months[matches[2].toLowerCase()];
  const year = matches[3];

  const isoDate = `${year}-${month}-${day}`;
  return isoDate;
}


function getData(url) {
  const p = url;
  const response = UrlFetchApp.fetch(p);

  const obj = JSON.parse(response);

  const location = obj.postalCode + ' ' + obj.city;
  const delivery = convertToISODate(obj.delivery);
  const upcoming = convertToISODate(obj.upcoming);

  const dates = {
    delivery: delivery,
    upcoming: upcoming
  }
  
  const data = {
    location: location,
    dates: dates
  }

  return data;
}


function getTimeZone() {
    if(config.useLocalTime) {
    return CalendarApp.getDefaultCalendar().getTimeZone();
  } else {
    return 'Etc/GMT';
  }
}
