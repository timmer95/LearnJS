function createUser (name) {
  const discordName = "@" + name;
  let reputation = 0;                         // private!!
  const getReputation = () => reputation;
  const giveReputation = () => reputation++;

  return { name, discordName, getReputation, giveReputation };
}
