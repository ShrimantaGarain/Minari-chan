# Minari-chan
A discord bot that uses ai to have a normal conversation with the user on vc



# This is just a simple discord bot that does vc with you on discord and below are the steps on how you can make it run by your own:
* **Configure the following in the config.json.**

   1."token": is your discord bot token.

   2."prefix": is the command prefix for your discord bot.
 
   3."vc_channel": is the voice channel the user wants the bot to talk in.
  
   4."botname": is the name of the bot.

   5."ownername": the owner aka daddy.
 
   6."microsoft_token": put a microsoft speech to text api key in here.
# ![Image of config.json](https://media.discordapp.net/attachments/831862241225343036/867690995477643265/unknown.png)



# How to make it work.
**Make a voice channel having limit of 2 people (one for the user and one for the bot). Then the person who is in the voice channel will do the command {prefix}speak (for eg if in your config.json the prefix was ">>" then the command to make the bot join the voice chat with you will look like *>>speak*.** 

# How it works and responds to your voice with its own voice.
* The bot joins the voice channel after you use the ***${prefix}speak*** command. 

* Then when you speak(green light appears around your avatar) it will start to __**record your voice and save it in a local file**__ (with .pcm extension).

* Then it __**converts the .pcm file to a wav**__ file.

* Then it __**uses the microsoft speech to text api**__ to get text from the user's audio. (Note: you might think that it will take a long time but surprisingly, microsoft speech to text api does a great job and the response is almost instant. >:3

* Then it ***uses the text response*** from the user's speech and __**sends it to a api**__ (you can find it in the main.ts file) to get a response.

* The **api returns a good response** to what the user said and now we are left with two options:
  1. Use the built in discord text-to-speech (tts) feature. (this one is extremely fast and this is what i recommend. 
  2. Use a npm package like node gtts and convert the text into a audio file and then make the bot play the file.


# Things to keep in mind:
* The bots requires you to stop talking for a split second once you complete your sentence so this bot will not work correctly if you mic is buggy and makes a sound throughout the conversation (to tackle this, once you complete your sentence you can use the discord mute button to mute yourself for a second)
* Your voice will need to be well audible so that microsoft text to speech api can process it accurately.
* After you complete your sentence kindly hold off on speaking again until the bot responds to you (;-; or the bot might break).
* Use this bot with only one person at a time. (only with one person in a voice channel along with bot, so keep the user limit of the voice channel to 2)
