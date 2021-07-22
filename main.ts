const Discord = require('discord.js');
const client = new Discord.Client();
import * as path from 'path';
import * as wavConverter from 'wav-converter';
const got = require('got');
const gtts = require('node-gtts')('en');
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
var onCooldown = false;
const{ token,prefix,microsoft_token,botname,ownername } = require('./config.json');
const speechConfig = sdk.SpeechConfig.fromSubscription(`${microsoft_token}`, "eastus");
import * as fs from 'fs';
import { Readable } from 'stream';
const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);
class Silence extends Readable {
  _read() {
    this.push(SILENCE_FRAME);
    this.destroy();
  }
}

  



      // Only try to join the sender's voice channel if they are in one themselves
  
client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async message => {

    if (message.content === `${prefix}speak` && message.member.voice.channel) {


    const connection = await message.member.voice.channel.join();
   
    connection.on('speaking', async (user: any, speaking: any) => {
      if (onCooldown) {
        
        return
      }
      else {
        if (speaking) {
          onCooldown = true;
          setTimeout(function () {
            onCooldown = false;
          }, 5000);
          console.log(`I'm listening to ${user}`);
    
          const voicechannel = message.member.voice.channel;
          if (!voicechannel) {
            message.channel.send("Please join a voice channel first!"); return;
          }
  
     


    
      
      
          const audioStream = connection.receiver.createStream(message.member, {
            mode: "pcm",
            end: "silence"
          });
    
          const writer = audioStream.pipe(fs.createWriteStream(`./components/recordings/${message.author.id}.pcm`));

   
   
   
   
          writer.on("finish", async () => {
        
        
        
      
        
            async function makewav() {
                
      
              var pcmData = fs.readFileSync(path.resolve(__dirname, `./components/recordings/${message.author.id}.pcm`));
              var wavData = wavConverter.encodeWav(pcmData, {
                  numChannels: 2,
                  sampleRate: 48000,
                  byteRate: 174
              })
              fs.writeFileSync(path.resolve(__dirname, `./components/speaking_audio/${message.author.id}.wav`), wavData);
               
            };

      
          
       
            await makewav()
            async function fromFile() {
              let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(`./components/speaking_audio/${message.author.id}.wav`));
              let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

              recognizer.recognizeOnceAsync(async result => {
            //    await message.channel.send(`You said --> ${result.text}`) //response from the api (the thing the person supposedly said)
                var msg = result.text
                got(`https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(msg)}&botname=${botname}&ownername=${ownername}`).then(async (response: { body: string; }) => {

                  let content = JSON.parse(response.body);
               
          /*      await message.channel.send(content.message, {    tts: true            //using the build in discord text to speech is almost instant and the delay is unnoticed while usign the method below to generate a audio file from a txt takes up a few seconds. 
                     })*/
                              
                  var audio_save_path = path.join(__dirname, `./components/speaking_audio/${message.author.id}.wav`);
                  gtts.save(audio_save_path, content.message, async function () {
   
   
                    const dispatcher = connection.play(`./components/speaking_audio/${message.author.id}.wav`);
   
                    dispatcher.on('start', () => {
                      console.log('now playing!');
                    }).on('finish', () => {
                      console.log('finished playing!');
                    }).on('error', console.error);


   
       
                  })



                }).catch((err: any) => {
                  console.log(err)
                });





                recognizer.close();
              });
            }
            fromFile();


      /*      await message.channel.send("Processing audio.....", {         //to use the below method of send the audio file to discord first and then to the servie api --> use this piece of code
              files: [
                `./components/speaking_audio/${message.author.id}.wav`
           
           
              ]
            })
       
           
            .then(msg => {
            console.log(msg.attachments.array()[0])
                     }).catch(console.error);             // if you use another api to get text from speech you can send the audio to discord as attachment and take the url from this and send it to the api for processing 
                     
            */

            await message.channel.send("Sending response.....");
          });

          connection.play(new Silence(), { type: 'opus' });
    
        }

      }
 
    });
            
  }



 

    if (message.content === "play") {  //if the user wants to play their own vocie
        const stream = fs.createReadStream(`./components/recordings/${message.author.id}.pcm`);
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(stream, {
        type: "converted"
    });
        dispatcher.on("finish", () => {
    //    message.member.voice.channel.leave();
        return message.channel.send("finished playing audio");
    })
}
    
});

client.login(token);