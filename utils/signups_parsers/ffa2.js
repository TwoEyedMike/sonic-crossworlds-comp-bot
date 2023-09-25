module.exports = {
  fields: [
    {
      key: /psn/i,
      name: 'psn',
      type: 'nickname',
    },
    {
      key: /host/i,
      name: 'host',
      type: 'boolean',
    },
    {
      key: /console/i,
      name: 'console',
      type: 'psConsole'
    },
    {
      key: /region/i,
      name: 'region',
      type: 'region'
    },
    {
      key: /nat type/i,
      name: 'natType',
      type: 'natType'
    }
  ],
  template: `PSN: ctr_tourney_bot
Host: Yes
Console: PS4 / PS5
Region: Europe / North America / South America / Africa / Asia / Australia
NAT Type: NAT 1 / NAT 2 Open / NAT 2 Closed / NAT 3`,
};
