//user objects

var users = [
{

	id: 'talentbuddy',
	name: 'Talentbuddy Team',
	email: 'team@talentbuddy.co',
	password: 'welovecode',
	followingIds: ['billgates']
},

{

	id: 'billgates',
	name: 'Bill Gates',
	email: 'bill@microsoft.com',
	password: 'microsoft',
	followingIds: []
} ];

//tweet objects
var tweets = [
{
	id: '1',
	userId: 'talentbuddy',
	created: 1419501600,
	text: 'Programming is easy'
},
{
	id: '2',
	 userId: 'billgates',
  	created: 1418212800,
  	text: 'Write more code'
},

{
  	id: '3',
  	userId: 'billgates',
  	created: 1418288400,
  	text: '2 billion people don\'t have a bank account'
}
];

module.exports.users = users;
module.exports.tweets = tweets;