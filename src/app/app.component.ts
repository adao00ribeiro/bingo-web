import { Component, effect, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { DialogAllWinnersComponent } from './components/dialogs/dialog-all-winners/dialog-all-winners.component';
import { EPrizeType } from './enums/EPrizeType';
import { AudioDataBaseService } from './services/audio-data-base.service';
import { DialogNumberSelectionComponent } from './components/dialogs/dialog-number-selection/dialog-number-selection.component';
import { DialogRouletteComponent } from './components/dialogs/dialog-roulette/dialog-roulette.component';
import { TimerService } from './services/timer.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'bingo-web';
 readonly dialog = inject(MatDialog);
 readonly audioDataBaseService = inject(AudioDataBaseService);
  readonly timerService = inject(TimerService);

  constructor( ) {
    let theme = 'bingo-dark';
    document.body.classList.add(theme);
    effect(()=>{
        const currentTime = this.timerService.AdjustedTime(); // <- acesso ao signal aqui
    console.log(currentTime); // agora ele vai reagir toda vez que mudar

    })
  }
  ngOnInit(): void {
  //this.openDialogRoulete();
  //this.audioDataBaseService.
  this.audioDataBaseService.initDatabase();

  }
  openDialogRoulete() {

    this.dialog.open(DialogRouletteComponent, {})

  }
  openDialogNumberSelection() {

    this.dialog.open(DialogNumberSelectionComponent, {})

  }
   openDialogWinner() {

     this.dialog.open(DialogAllWinnersComponent, {
          disableClose: true,
          maxWidth: '95vw',
          maxHeight: '95vh',
          height: '95%',
          width: '95%',
          data: {
            results:[
              {
                prizeType: EPrizeType.Diagonal,
                winningCards:[
                {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                },   {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                },   {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                },   {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                },   {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                },   {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                },   {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                },   {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                },   {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                },   {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                },   {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                }

                ]
              },
              {
                prizeType: EPrizeType.Diagonal,
                winningCards:[
                {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                }

                ]
              },
              {
                prizeType: EPrizeType.Diagonal,
                winningCards:[
                {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                }

                ]
              },
              {
                prizeType: EPrizeType.Diagonal,
                winningCards:[
                {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                }

                ]
              },
              {
                prizeType: EPrizeType.Diagonal,
                winningCards:[
                {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                }

                ]
              },
              {
                prizeType: EPrizeType.Diagonal,
                winningCards:[
                {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                }

                ]
              },
              {
                prizeType: EPrizeType.Diagonal,
                winningCards:[
                {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                }

                ]
              },
              {
                prizeType: EPrizeType.Diagonal,
                winningCards:[
                {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                }

                ]
              },
              {
                prizeType: EPrizeType.Diagonal,
                winningCards:[
                {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                }

                ]
              },
              {
                prizeType: EPrizeType.Diagonal,
                winningCards:[
                {
                  punter:{
                    name:"adao"
                  },
                  card:{
                    id:"1234"
                  },
                  valueOfEachWinner:20
                }

                ]
              },


            ]

          }
        });


    }
}
