import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { DialogAllWinnersComponent } from './components/dialogs/dialog-all-winners/dialog-all-winners.component';
import { EPrizeType } from './enums/EPrizeType';
import { AudioDataBaseService } from './services/audio-data-base.service';
import { DialogNumberSelectionComponent } from './components/dialogs/dialog-number-selection/dialog-number-selection.component';
import { DialogRouletteComponent } from './components/dialogs/dialog-roulette/dialog-roulette.component';
import { TimerService } from './services/timer.service';
import { MatIcon } from '@angular/material/icon';
import { ThemeService } from './services/theme.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'bingo-web';

  readonly dialog = inject(MatDialog);
  readonly audioDataBaseService = inject(AudioDataBaseService);
  readonly themeService = inject(ThemeService);
  readonly timerService = inject(TimerService);

    private router = inject(Router);
  isNavigating = computed(() => {
    console.log(this.router.getCurrentNavigation())
    return !!this.router.getCurrentNavigation()
  }
      );

  constructor() {


    //document.documentElement.style.setProperty('--background-color-primary', `#fff`);


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
        results: [
          {
            prizeType: EPrizeType.Diagonal,
            winningCards: [
              {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }, {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }, {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }, {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }, {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }, {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }, {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }, {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }, {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }, {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }, {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }

            ]
          },
          {
            prizeType: EPrizeType.Diagonal,
            winningCards: [
              {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }

            ]
          },
          {
            prizeType: EPrizeType.Diagonal,
            winningCards: [
              {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }

            ]
          },
          {
            prizeType: EPrizeType.Diagonal,
            winningCards: [
              {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }

            ]
          },
          {
            prizeType: EPrizeType.Diagonal,
            winningCards: [
              {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }

            ]
          },
          {
            prizeType: EPrizeType.Diagonal,
            winningCards: [
              {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }

            ]
          },
          {
            prizeType: EPrizeType.Diagonal,
            winningCards: [
              {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }

            ]
          },
          {
            prizeType: EPrizeType.Diagonal,
            winningCards: [
              {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }

            ]
          },
          {
            prizeType: EPrizeType.Diagonal,
            winningCards: [
              {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }

            ]
          },
          {
            prizeType: EPrizeType.Diagonal,
            winningCards: [
              {
                punter: {
                  name: "adao"
                },
                card: {
                  id: "1234"
                },
                valueOfEachWinner: 20
              }

            ]
          },


        ]

      }
    });


  }


}
