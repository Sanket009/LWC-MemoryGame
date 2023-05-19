import { LightningElement } from 'lwc';
import {loadStyle} from 'lightning/platformResourceLoader'//loadstyle load css
import fontawesome from '@salesforce/resourceUrl/fontawesome'


export default class Memorygame extends LightningElement {

    isLibLoaded=false

    openedCards =[]
    matchedCard=[]
    totalTime='00:00'
    moves=0
    timerRef
    showCongratulations = false
    cards=[
        {id:1, listClass:"card",type:'apple',icon:'fa fa-apple'},
        {id:2, listClass:"card",type:'amazon',icon:'fa fa-amazon'},
        {id:3, listClass:"card",type:'btc',icon:'fa fa-btc'},
        {id:4, listClass:"card",type:'yt',icon:'fa fa-youtube-play '},
        {id:5, listClass:"card",type:'thumbs',icon:'fa fa-thumbs-up'},
        {id:6, listClass:"card",type:'plane',icon:'fa fa-plane '},
        {id:7, listClass:"card",type:'btc',icon:'fa fa-btc'},
        {id:8, listClass:"card",type:'amazon',icon:'fa fa-amazon'},
        {id:9, listClass:"card",type:'git',icon:'fa-github'},
        {id:10, listClass:"card",type:'yt',icon:'fa fa-youtube-play'},
        {id:11, listClass:"card",type:'taxi',icon:'fa fa-taxi'},
        {id:12, listClass:"card",type:'plane',icon:'fa fa-plane '},
        {id:13, listClass:"card",type:'thumbs',icon:'fa fa-thumbs-up '},
        {id:14, listClass:"card",type:'taxi',icon:'fa fa-taxi '},
        {id:15, listClass:"card",type:'git',icon:'fa-github'},
        {id:16, listClass:"card",type:'apple',icon:'fa fa-apple'},


    ]
     
    get gameRating(){
        let stars =  this.moves<12 ? [1,2,3]:this.moves>=13 ? [1,2]:[1]
      return this.matchedCard.length ===16 ? stars :[]
      }
    displayCard(event){
        let currCard = event.target
        currCard.classList.add("open", "show", "disabled")
        this.openedCards = this.openedCards.concat(event.target)
        const len = this.openedCards.length
        if(len === 2){
          this.moves = this.moves+1
          if(this.moves === 1){
              this.timer()
          }
          if(this.openedCards[0].type === this.openedCards[1].type){
              this.matchedCard = this.matchedCard.concat(this.openedCards[0], this.openedCards[1])
              this.matched()
          } else {
              this.unmatched()
          }
        }
    }

    matched(){
        this.openedCards[0].classList.add("match", "disabled")
        this.openedCards[1].classList.add("match", "disabled")
        this.openedCards[0].classList.remove("show", "open")
        this.openedCards[1].classList.remove("show", "open")
        this.openedCards=[]
        if(this.matchedCard.length === 16){
            window.clearInterval(this.timerRef)
            this.showCongratulations = true
        }
    }
    unmatched(){
      this.openedCards[0].classList.add("unmatched")
      this.openedCards[1].classList.add("unmatched")
      this.action('DISABLE')
      setTimeout(()=>{
          this.openedCards[0].classList.remove("show", "open", "unmatched")
          this.openedCards[1].classList.remove("show", "open", "unmatched")
          this.action('ENABLE')
          this.openedCards=[]
      },1100)
    }

    action(action){
        let cards = this.template.querySelectorAll('.card')
        Array.from(cards).forEach(item=>{
            if(action === 'ENABLE'){
                let isMatch = item.classList.contains('match')
                if(!isMatch){
                    item.classList.remove('disabled')
                }
            }
            if(action === 'DISABLE'){
                item.classList.add('disabled')
            }
        })
    }

    timer(){
        let startTime = new Date()
        this.timerRef = setInterval(()=>{
          let diff = new Date().getTime() - startTime.getTime()
          let d = Math.floor(diff/1000)
          const m = Math.floor(d % 3600 / 60);
          const s = Math.floor(d % 3600 % 60);
          const mDisplay = m>0 ? m+(m===1? "minute, ":" minutes, "):""
          const sDisplay = s>0 ? s+(s===1? "second":" seconds"):""
          this.totalTime = mDisplay + sDisplay
        }, 1000)
    }

    shuffle(){
      this.showCongratulations = false
      this.openedCards =[]
      this.matchedCard=[]
      this.totalTime='00:00'
      this.moves=0
      window.clearInterval(this.timerRef)
      let elem = this.template.querySelectorAll('.card')
      Array.from(elem).forEach(item=>{
          item.classList.remove("show", "open", "match", "disabled")
      })
      /***shuffling and swaping logic */
      let array = [...this.cards]
      let counter = array.length
      while(counter>0){
          let index = Math.floor(Math.random()*counter)
          counter--

          let temp = array[counter]
          array[counter] = array[index]
          array[index] = temp
      }
      this.cards = [...array]
    }
  renderedCallback(){
      if(this.isLibLoaded){
          return
      } else {
          loadStyle(this,fontawesome+'/fontawesome/css/font-awesome.min.css').then(()=>{
              console.log("loaded successfully")
          }).catch(error=>{
              console.error(error)
          })
          this.isLibLoaded = true
      }
  }
}