export class CronJob {
  public name!: string;
  public time!: string;

  public run!: () => Promise<void>;
  public start!: () => void;
}
