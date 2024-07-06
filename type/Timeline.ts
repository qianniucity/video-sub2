// Timeline.ts
import { Subtitle } from './subtitle';

export class Timeline {
  private subtitles: Subtitle[] = [];
  private nextId: number = 1;

  addSubtitle(startTime: string, endTime: string, text: string): void {
	this.subtitles.push({
	  id: this.nextId++,
	  startTime,
	  endTime,
	  text,
	});
  }

  removeSubtitle(id: number): void {
	this.subtitles = this.subtitles.filter(subtitle => subtitle.id !== id);
  }

  editSubtitle(id: number, startTime: string, endTime: string, text: string): void {
	const subtitle = this.subtitles.find(subtitle => subtitle.id === id);
	if (subtitle) {
	  subtitle.startTime = startTime;
	  subtitle.endTime = endTime;
	  subtitle.text = text;
	}
  }

  getSubtitles(): Subtitle[] {
	return this.subtitles;
  }
}