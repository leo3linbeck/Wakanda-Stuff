
guidedModel =// @startlock
{
	BallotMeasure :
	{
		methods :
		{// @endlock
			conjure:function(c, w)
			{// @lock
				var b = ds.BallotMeasure.find('state.ID = :1 AND title = :2', w.state.ID, c.referendumTitle);
				if (b == null) {
					b = ds.BallotMeasure.createEntity();
					b.state = w.state;
					b.calendar = w;
					b.type = c.type;
					b.title = c.referendumTitle;
					b.titleURL = c.referendumUrl;
					b.subject = c.referendumSubtitle;
					b.subjectURL = c.referendumUrl;
					b.description = c.referendumSubtitle;
					b.save();
				}
				
				return b;
			}// @startlock
		}
	},
	Zip9District :
	{
		methods :
		{// @endlock
			conjure:function(z, d)
			{// @lock
				var c = ds.Zip9District.find('district.ID = :1 AND zip9.ID = :2', d.ID, z.ID);
				if (c == null) {
					c = ds.Zip9District.createEntity();
					c.district = d;
					c.zip9 = z;
					c.save();
				}
				
				return c;
			}// @startlock
		}
	},
	Campaign :
	{
		collectionMethods :
		{// @endlock
			merge:function(data)
			{// @lock
				var currentCollection = this;
				var cDeleteCollection = ds.Campaign.createEntityCollection();
				var pStorageAttr = ['fullName', 'officialURL', 'ballotpediaURL', 'photoURL', 'email', 'phone', 'orderOnBallot'];
				
				var k = [];
				currentCollection.forEach(function(c) {
					if (k.indexOf(c.election.ID) == -1)
						k.push(c.election.ID);
				});
				if (k.length != 1)
					return ( { success: false, msg: 'You may only merge campaigns for the same election. k = ' + k, deleted: cDeleteCollection, preserved: currentCollection } );

				var p = currentCollection.query('ID = :1', data.primaryID);
				if (p.length == 0)
					return ( { success: false, msg: 'Primary ID not in selection', deleted: cDeleteCollection, preserved: currentCollection } );
				var pp = p[0].politician;
					
				var s = null;
				var ss = null;
				if (data.secondaryID != null && data.secondaryID != '') {
					var s = currentCollection.query('ID = :1', data.secondaryID);
					if (s.length == 0)
						return ( { success: false, msg: 'Secondary ID not in selection', deleted: cDeleteCollection, preserved: currentCollection } );
					else
						ss = s[0].politician;
				}
					
				var t = null;
				var tt = null;
				if (data.tertiaryID != null && data.tertiaryID != '') {
					if (data.secondaryID == null || data.secondaryID == '')
						return ( { success: false, msg: 'Tertiary ID given with no Secondary ID', deleted: cDeleteCollection, preserved: currentCollection } );
					var t = currentCollection.query('ID = :1', data.tertiaryID);
					if (t.length == 0)
						return ( { success: false, msg: 'Tertiary ID not in selection', deleted: cDeleteCollection, preserved: currentCollection } );
					else
						tt = t[0].politician;
				}
				
				try {
					ds.startTransaction();
					
					currentCollection.forEach(function(c) {
						if (c.ID == p.ID) {
							for (var a in ds.Politician.attributes) {
								if (pStorageAttr.indexOf(a) != -1 && pp[a] == null) {
									if (ss != null && ss[a] != null)
										pp[a] = ss[a];
									else if (tt != null && tt[a] != null)
										pp[a] = tt[a];
								}
							}
							pp.save();
						}
						else {
							ds.Vote.query('candidate.ID = :1', c.ID).forEach(function(x) {
								x.candidate = p[0];
								x.save();
							});
							cDeleteCollection.add(c);
						}
					});
					
					cDeleteCollection.remove();
					
					ds.commit();
				}
				catch(e) {
					ds.rollBack();
					return ( { success: false, msg: 'Merge failed. ' + e.toString(), deleted: ds.Politician.createEntityCollection(), preserved: currentCollection} );
				}
	
				currentCollection.minus(cDeleteCollection);
				return ( { success: true, msg: 'Merge succeeded. ' + currentCollection.length + ' campaigns merged.', deleted: null, preserved: currentCollection} );

			}// @startlock
		},
		entityMethods :
		{// @endlock
			personVote:function(personID)
			{// @lock
				return this.votes.find('person.ID = :1', personID) != null;
			}// @startlock
		},
		voteTotal :
		{
			onGet:function()
			{// @endlock
				return this.votes.count();
			}// @startlock
		},
		methods :
		{// @endlock
			conjure:function(e, p)
			{// @lock
				var c = ds.Campaign.find('politician.ID = :1 AND election.ID = :2', p.ID, e.ID);
				if (c == null) {
					c = ds.Campaign.createEntity();
					c.election = e;
					c.politician = p;
					c.save();
				}
				
				return c;
			}// @startlock
		}
	},
	Election :
	{
		contested :
		{
			onGet:function()
			{// @endlock
				return this.campaigns.count() > this.numberOfReps;
			}// @startlock
		},
		numberOfCandidates :
		{
			onGet:function()
			{// @endlock
				return this.campaigns.count();
			}// @startlock
		},
		methods :
		{// @endlock
			conjure:function(c, d, w)
			{// @lock
				var e = ds.Election.find('district.ID = :1 and calendar.ID = :2', d.ID, w.ID);
				if (e == null) {
					e = ds.Election.createEntity();
					e.district = d;
					e.calendar = w;
					e.type = c.type;
					e.year = w.electionDay.getFullYear();
					e.state = d.state;
					e.numberOfRepsToVoteFor = c.numberVotingFor ? c.numberVotingFor : d.numberOfReps;
					e.level = c.level;
					switch (d.type) {
						case 'presidential':
							e.sortLevel = 1;
							break;
						case 'senatorial':
							e.sortLevel = 5;
							break;
						case 'congressional':
							e.sortLevel = 10;
							break;
						case 'statewide':
							e.sortLevel = 20;
							break;
						case 'stateUpper':
							e.sortLevel = 30;
							break;
						case 'stateLower':
							e.sortLevel = 40;
							break;
						case 'countywide':
							e.sortLevel = 50;
							break;
						case 'countyCouncil':
							e.sortLevel = 50;
							break;
						default:
							e.sortLevel = 100;
					}
					e.save();
				}
				
				return e;
			}// @startlock
		}
	},
	Person :
	{
		methods :
		{// @endlock
			socialSignin:function(r)
			{// @lock
				var p = null;
				var profile = r.profile;
				
				p = ds.SocialProfile.find('identifier = :1', profile.identifier);
				if (p == null) {
					z = ds.Person.createEntity();
					p = ds.SocialProfile.createEntity();
					p.person = z;
					p.identifier = profile.identifier;
					p.providerName = profile.providerName;
					p.save();
					z.save();
				}
				else
					z = p.person;
					
				z.latestSocialProfile = p.identifier;
				
				try {
					var url = 'https://rpxnow.com/api/v2/map';
					var xhr = new XMLHttpRequest(); 
					xhr.open('POST', url, false); // to connect to a Web site synchronously
					xhr.setRequestHeader('Content-Type','application/json');
					var data = { primaryKey: String(z.ID), identifier: profile.identifier, apiKey: require('janrain.api_key').janrain_api_key() };
					xhr.send(JSON.stringify(data)); // send the request
				} catch (e) {
					return ( { success: false, id: 'socialMediaMappingFailed', message: 'Social media mapping failed.' } );
				}
										
				if (profile.displayName) {
					p.displayName = profile.displayName;
					z.name = z.name ? z.name : profile.displayName;
				}
				
				if (profile.preferredUsername) {
					p.preferredUsername = profile.preferredUsername;
					z.username = z.username ? z.username : profile.preferredUsername;
				}
				
				if (profile.name) {
					p.name = profile.name.formatted;
					p.familyName = profile.familyName;
					p.givenName = profile.givenName;
					p.middleName = profile.middleName;
					p.honorificPrefix = profile.honorificPrefix;
					p.honorificSuffix = profile.honorificSuffix;
				}
				if (profile.gender)
					p.gender = profile.gender;
				if (profile.birthday)
					p.birthday = profile.birthday;
				if (profile.utcOffset)
					p.utcOffset = profile.utcOffset;
				if (profile.verifiedEmail) {
					p.verifiedEmail = profile.verifiedEmail;
					z.latestEmailAddress = z.latestEmailAddress ? z.latestEmailAddress : profile.verifiedEmail;
				}
				if (profile.email) {
					p.email = profile.email;
					z.latestEmailAddress = z.latestEmailAddress ? z.latestEmailAddress : profile.email;
				}
				if (profile.URL)
					p.url = profile.URL;
				if (profile.phoneNumber)
					p.phoneNumber = profile.phoneNumber;
				if (profile.address) {
					p.address = profile.address.formatted;
					p.streetAddress = profile.address.streetAddress;
					p.city = profile.address.locality;
					p.state = profile.address.region;
					p.zip = profile.address.postalCode;
					
					z.address1 = z.address1 ? z.address1 : profile.address.streetAddress;
					z.city = z.city ? z.city : profile.address.locality;
					z.state = z.state ? z.state : profile.address.region;
					z.zip = z.zip ? z.zip : profile.address.postalCode;
				}
								
				p.save();
				z.save();
				z.refresh();

				return z;
			},// @lock
			conjure:function(id, addr1, addr2, city, v)
			{// @lock
				if (id)
					var z = this.find('ID = :1', id);
				else
					var z = this.find('uspsLine1 = :1 AND uspsLine2 = :2', v.firstLine, v.secondLine);
				
				if (z == null)
					z = this.createEntity();
					
				z.address1 = addr1;
				z.address2 = addr2;
				z.city = city;
				z.state = v.ST;
				z.zip9 = v.zip9Record;
				z.uspsLine1 = v.firstLine;
				z.uspsLine2 = v.secondLine;
				z.stateRelation = v.s;
				z.save();
				z.refresh();
				
				return z;
			}// @startlock
		}
	},
	Zip9 :
	{
		methods :
		{// @endlock
			conjure:function(zip9, s)
			{// @lock
				var z = this.find('zipCode = :1', zip9);
				if (z == null) {
					z = ds.Zip9.createEntity();
					z.zipCode = zip9;
					z.state = s;
					z.save();
					z.refresh();
				}
				
				return z;
			}// @startlock
		}
	},
	District :
	{
		methods :
		{// @endlock
			conjure:function(c, s)
			{// @lock
				var num = c.numberElected ? c.numberElected : 1;
				var re = /\(Vote for (\d*)\)/.exec(c.office);
				if (re) {
					var num = Number(re[1]);
					c.office = c.office.substr(0, c.office.length - re[0].length).trim();
				}
				
				if (c.office == 'President & Vice President') {
					var d = ds.District.find('name = :1', c.office);
					if (d == null) {
						d = ds.District.createEntity();
						d.name = c.office;
						d.googleID = c.district.id;
						d.numberOfReps = 1;
						d.type = 'presidential';
						d.state = null;
						d.level = c.level;
						d.save();
						d.refresh();
					}
				}
				else {
					var d = ds.District.find('name = :1 AND googleID = :2', c.office, c.district.id);
					if (d == null) {
						d = ds.District.createEntity();
						d.name = c.office;
						d.googleID = c.district.id;
						d.numberOfReps = num;
						if (c.office == 'U. S. Senator') {
							d.type = 'senatorial';
							d.state = s;
						}
						else {
							d.type = c.district.scope;
							d.state = s;
						}
						d.level = c.level;
						d.save();
						d.refresh();
					}
				}
				
				return d;
			}// @startlock
		}
	},
	ElectionCalendar :
	{
		methods :
		{// @endlock
			conjure:function(w, s)
			{// @lock
				var c = ds.ElectionCalendar.find('googleID = :1', w.id);
				if (c == null) {
					c = ds.ElectionCalendar.createEntity();
					c.googleID = w.id;
					c.name = w.name;
					c.state = s;
					c.electionDay = Date.parseExact(w.electionDay, 'yyyy-mm-dd');
					c.save();
				}
				
				return c;
			}// @startlock
		}
	},
	Politician :
	{
		methods :
		{// @endlock
			conjure:function(c, w)
			{// @lock
				var x = ds.Party.conjure(c.party);
				var p = ds.Politician.find('fullName = :1 AND party.ID = :2 AND state.ID = :3', c.name, x.ID, w.state.ID);
				if (p == null) {
					p = ds.Politician.createEntity();
					p.fullName = c.name;
					p.party = x;
					p.state = w.state;
					p.officialURL = c.candidateUrl;
					p.ballotpediaURL = 'http://ballotpedia.org/wiki/index.php/' + c.name.replace(/ /g,'_');
					p.phone = c.phone;
					p.email = c.email;
					p.photoURL = c.photoUrl;
					p.orderOnBallot = c.orderOnBallot;
					p.save();
				}
				
				return p;
			}// @startlock
		}
	},
	State :
	{
		methods :
		{// @endlock
			conjure:function(abbr, state_array)
			{// @lock
				var s = ds.State.find('abbreviation = :1', abbr);
				if (s == null) {
					var a = state_array[abbr];
					if (a === undefined)
						throw ( { success: false, id: 'nullState', message: 'State could not be found' } );
					s = ds.State.createEntity();
					s.ID = a[0];
					s.abbreviation = abbr;
					s.name = a[1];
					s.censusCode = a[0];
					s.save();
				}
				
				return s;
			}// @startlock
		}
	},
	Party :
	{
		methods :
		{// @endlock
			conjure:function(name)
			{// @lock
				var p = ds.Party.find('name = :1', name);
				if (p == null) {
					p = ds.Party.createEntity();
					p.name = name;
					switch (name) {
						case 'Democratic':
							p.abbreviation = 'D';
							break;
						case 'Democrat':
							p.abbreviation = 'D';
							break;
						case 'Republican':
							p.abbreviation = 'R';
							break;
						case 'Libertarian':
							p.abbreviation = 'L';
							break;
						case 'Green':
							p.abbreviation = 'G';
							break;
						case 'Socialist':
							p.abbreviation = 'S';
							break;
						case 'Non-Partisan':
							p.abbreviation = 'X';
							break;
						case 'Constitution':
							p.abbreviation = 'F';
							break;
						case 'Conservative':
							p.abbreviation = 'C';
							break;
						default:
							p.abbreviation = '';
					}
					p.save();
				}
				
				return p;
			}// @startlock
		}
	}
};// @endlock
