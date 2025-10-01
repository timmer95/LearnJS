// ------------------------------//
//      CREATING THE OBJECT      //
// ------------------------------//

// CONSTRUCTOR FUNCTION 
// == prototype

const User = function (name) {
  this.name = name;
  this.discordName = "@" + name;
}


// FACTORY FUNCTION
function createUser (name) {
  const discordName = "@" + name;
  let reputation = 0;                         // private!!
  const getReputation = () => reputation;
  const giveReputation = () => reputation++;

  return { name, discordName, getReputation, giveReputation };
}

// ------------------------------//
//           INHERITANCE         //
// ------------------------------//

// CONSTRUCTOR FUNCTION 
const Player = function(name, team) {
  this.name = name;
  this.team = team;
}

// the ugly way
Object.setPrototypeOf(Player.prototype, User.prototype);

// Initialize Child in constructor F
function Player(name, team) {
  // Chain constructor with call
  User.call(this, name);

  // Add a new property
  this.team = team;
}


// FACTORY FUNCTION
function createPlayer (name, level) {
  const { getReputation, giveReputation } = createUser(name);

  const increaseLevel = () => level++;
  return { name, getReputation, giveReputation, increaseLevel };
}


