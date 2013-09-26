var alphaNum = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

module.exports =
{
    randomAlphaNnumeric: function(numChars)
    {
        numChars = numChars || 12;

        var buf = [];
        var alphaNumLen = alphaNum.length;
        for(var i=0; i<numChars; i++)
        {
            buf.push(alphaNum.charAt(Math.floor(Math.random()*alphaNumLen)));
        }
        return buf.join("");
    }
};
