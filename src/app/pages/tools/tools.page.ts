import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { interval } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LAYOUT, TCG, TCG_PATH_AUDIO, URL_IMG } from '../../models.ts/tcg.model';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './tools.page.html',
  styleUrl: './tools.page.css',
})
export class ToolsPage {
  public timers_list: any[] = [];
  public timer_name = "";
  public current_minutes = 0;
  public additional_minutes = 0;
  public layout = LAYOUT.ROWS;
  public LAYOUTS = LAYOUT;
  public TCG_TYPE = [TCG.DIGIMON, TCG.POKEMON].sort((a, b) =>
    a.localeCompare(b)
  );
  public selected_tcg = this.TCG_TYPE[0];
  public MINUTES_LIST = [0, 1, 2, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

  public changeLayout() {
    this.layout = this.layout === LAYOUT.ROWS ? LAYOUT.CARDS : LAYOUT.ROWS;
  }
  public addTimer() {
    const timer = {
      id: Date.now(),
      isOn: false,
      name: this.timer_name,
      label: `${this.pad(this.current_minutes)}:00`,
      sub_label: `${this.pad(this.additional_minutes)}:00`,
      total_seconds: this.current_minutes * 60,
      total_sub_seconds: this.additional_minutes * 60,
      tcg: this.selected_tcg,
      lock_bg: false,
      url_img: "",
      tcg_bg: '',
      timer_sub: {},
      sound: {},
    };
    if (this.selected_tcg === TCG.DIGIMON) {
      timer.url_img = URL_IMG.DIGIMON;
      timer.tcg_bg = 'digimon-img-bg';
      timer.sound = new Audio(TCG_PATH_AUDIO.DIGIVICE_SOUND);
    } else {
      timer.url_img = URL_IMG.POKEMON;
      timer.tcg_bg = 'pokemon-img-bg';
      timer.sound = new Audio(TCG_PATH_AUDIO.POKE_WIN_SOUND);
    }
    this.timers_list.push(timer);
    this.resetSelects();
  }

  public runAllTimers() {
    for (const timer of this.timers_list) {
      if (timer && !timer.isOn) {
        this.runTimer(timer);
      }
    }
  }

  public pauseAllTimers() {
    for (const timer of this.timers_list) {
      if (timer && timer.isOn) {
        timer.timer_sub.unsubscribe();
        timer.isOn = false;
      }
    }
  }

  public pauseTimer(data: any) {
    const timer = this.timers_list.find((timer: any) => timer.id === data.id);
    if (timer && timer.isOn) {
      timer.timer_sub.unsubscribe();
      timer.isOn = false;
    }
  }

  public deleteTimer(data: any) {
    console.log(data);
    const indexOf = this.timers_list.findIndex((timer: any) => timer.id === data.id);
    if (indexOf !== -1) {
      if (this.timers_list[indexOf].isOn) {
        this.timers_list[indexOf].timer_sub.unsubscribe();
      }
      this.timers_list.splice(indexOf, 1);
    }
  }

  public runTimer(data: any) {
    const timer = this.timers_list.find((timer: any) => timer.id === data.id);
    if (timer && !timer.isOn) {
      timer.isOn = true;
      timer.timer_sub = interval(1000).subscribe(() => {
        if (timer.total_seconds > 0) {
          this.updateTimer(timer, {
            total_seconds: 'total_seconds',
            current_minutes: 'current_minutes',
            label: 'label',
          });
        } else if (timer.total_sub_seconds > 0) {
          this.updateTimer(timer, {
            total_seconds: 'total_sub_seconds',
            current_minutes: 'additional_minutes',
            label: 'sub_label',
          });
        } else {
          timer.timer_sub.unsubscribe();
        }
      });
    }
  }

  private updateTimer(timer: any, keys: any) {
    timer[keys.total_seconds]--;
    timer[keys.current_minutes] = Math.floor(timer[keys.total_seconds] / 60);
    timer[keys.label] = `${this.pad(timer[keys.current_minutes])}:${this.pad(
      timer[keys.total_seconds] % 60
    )}`;
    if (timer[keys.total_seconds] === 0) {
      timer[keys.label] = '--:--';
      timer.sound.play();
      timer.tcg_bg = this.getPlaneBackgrouns(timer.tcg);
      timer.lock_bg = false;
    }else if (!timer.lock_bg && timer[keys.total_seconds] < 60) {
      timer.lock_bg = true;
      timer.tcg_bg = this.getAnimationsBackgrouns(timer.tcg);
    }
  }

  private getAnimationsBackgrouns(tcg: string) {
    switch (tcg) {
      case TCG.DIGIMON:
        return 'digi-time-animation';
      case TCG.POKEMON:
        return 'poke-time-animation';
      default:
        return '';
    }
  }

  private getPlaneBackgrouns(tcg: string) {
    switch (tcg) {
      case TCG.DIGIMON:
        return 'digimon-img-bg';
      case TCG.POKEMON:
        return 'pokemon-img-bg';
      default:
        return '';
    }
  }

  private pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  private resetSelects() {
    this.current_minutes = 0;
    this.additional_minutes = 0;
    this.timer_name = "";
    this.selected_tcg = this.TCG_TYPE[0];
  }
}
