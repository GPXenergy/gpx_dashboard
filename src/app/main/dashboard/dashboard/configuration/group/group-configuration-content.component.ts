import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { GroupMeter, GroupParticipant } from '@gpx/models/group-meter.model';
import { AuthService } from '@gpx/services/auth.service';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { FormValidatorService } from '@gpx/forms/validator.service';
import { Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateGroupMeterDialogComponent,
  CreateGroupMeterDialogResult
} from './create-group-meter-dialog/create-group-meter-dialog.component';
import { SnackBarService } from '@gpx/services/snack-bar.service';
import { AuthUser } from '@gpx/models/auth-user.model';
import {
  GroupMeterService,
  GroupParticipationService,
  ManageGroupParticipationService
} from '@gpx/services/api/group-meter.service';
import { pkType } from '@gpx/models/base';
import { ActivatedRoute, Router } from '@angular/router';
import {
  JoinGroupMeterDialogComponent,
  JoinGroupMeterDialogResult
} from './join-group-meter-dialog/join-group-meter-dialog.component';
import { Meter } from '@gpx/models/meter.model';
import {
  ChangeGroupManagerDialogComponent,
  ChangeGroupManagerDialogResult
} from './change-group-manager-dialog/change-group-manager-dialog.component';


@Component({
  selector: 'gpx-group-config-content',
  templateUrl: './group-configuration-content.component.html',
  styleUrls: ['./group-configuration-content.component.scss'],
})
export class GroupConfigurationContentComponent implements OnInit, OnDestroy {
  user: AuthUser;
  selectedMeter: Meter;
  groupMeter: GroupMeter;
  groupParticipant: GroupParticipant;
  groupMeterForm: ModelFormGroup<GroupMeter>;
  groupParticipantForm: ModelFormGroup<GroupParticipant>;
  // UI
  isGroupManager: boolean; // current user is managing the group
  isCopied: boolean;
  invitationUrl: string;
  timeOut: NodeJS.Timeout;
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private _snackBar: SnackBarService,
              private groupMeterService: GroupMeterService,
              private manageGroupParticipationService: ManageGroupParticipationService,
              private groupParticipantService: GroupParticipationService,
              private meterSelectionService: MeterSelectionService,
              private formBuilder: ModelFormBuilder,
              private formValidator: FormValidatorService,
              private dialog: MatDialog,
              private titleService: Title) {
    this.titleService.setTitle('Groepsmeter Instellingen | GPX');
  }


  ngOnInit(): void {
    this.authService.user.then(user => {
      this.user = user;

      this.meterSelectionService.selectedMeter.pipe(takeUntil(this._unsubscribeAll)).subscribe(meter => {
        this.selectedMeter = meter;
        if (meter) {
          this.groupParticipant = meter.getGroupParticipation();
          if (this.groupParticipant) {
            this.initParticipantForm(this.groupParticipant);
            this.getGroupMeterData(this.groupParticipant.getGroup().pk);
          }
        }
      });
    });


    this.route.queryParamMap.pipe(takeUntil(this._unsubscribeAll)).subscribe(params => {
      const invite = params.get('invite');
      if (invite) {
        this.joinGroupMeter(invite);
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getGroupMeterData(groupPk: pkType): void {
    this.groupMeterService.getGroupMeter(this.user.pk, groupPk).subscribe(groupMeter => {
      this.groupMeter = groupMeter;

      this.isGroupManager = this.groupMeter.getManager().pk === this.user.pk;
      this.invitationUrl = this.groupMeter.invitationUrl;
      if (this.isGroupManager) {
        this.initGroupMeterForm(this.groupMeter);
      } else {
        this.groupMeterForm = null;
      }

    });
  }

  createGroupMeter(): void {
    const dialogRef = this.dialog.open(CreateGroupMeterDialogComponent, {
      width: '500px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: CreateGroupMeterDialogResult) => {
      if (result.groupMeter) {
        this._snackBar.success({
          title: 'Nieuwe groep is succesvol aangemaakt!',
        });
        this.meterSelectionService.updateMeters(this.user);
      }
    });
  }

  joinGroupMeter(key: string): void {
    const dialogRef = this.dialog.open(JoinGroupMeterDialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        invitationKey: key
      }
    });

    dialogRef.afterClosed().subscribe((result: JoinGroupMeterDialogResult) => {
      if (result.groupParticipant) {
        this._snackBar.success({
          title: `Welkom bij groep ${result.groupParticipant.getGroup().name}!`,
        });
        this.meterSelectionService.updateMeters(this.user);
      }
      this.router.navigate(['.'], {relativeTo: this.route});
    });
  }

  copyLink(): void {
    this.isCopied = true;
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.isCopied = false;
    }, 1500);
  }

  updateGroupParticipant(): void {
    this.groupParticipantForm.markAsTouched();
    if (this.groupParticipantForm.valid) {
      const participant = this.groupParticipantForm.getModel();
      this.groupParticipantService.updateGroupParticipant(this.user.pk, this.groupParticipant.pk, participant).subscribe(
        updatedParticipant => {
          this.groupParticipant.deserialize(updatedParticipant);
          this.initParticipantForm(updatedParticipant);
          this._snackBar.success({
            title: `Instellingen zijn succesvol aangepast!`,
          });
          // Update the participant name in the existing list
          const list_p = this.groupMeter.getParticipants().find(p => p.pk === updatedParticipant.pk);
          list_p?.deserialize(updatedParticipant);
        },
        e => {
          if (e.error && e.status === 400) {
            this.groupParticipantForm.applyRemoteErrors(e.error);
          }
        }
      );
    }
  }

  updateGroupMeter(): void {
    this.groupMeterForm.markAsTouched();
    if (this.groupMeterForm.valid) {
      const group = this.groupMeterForm.getModel();
      this.groupMeterService.updateGroupMeter(this.user.pk, this.groupMeter.pk, group).subscribe(
        updatedGroup => {
          this.groupMeter.deserialize(updatedGroup);
          this.initGroupMeterForm(updatedGroup);
          this._snackBar.success({
            title: `Groep "${updatedGroup.name}" is succesvol aangepast!`,
          });
        },
        e => {
          if (e.error && e.status === 400) {
            this.groupMeterForm.applyRemoteErrors(e.error);
          }
        }
      );
    }
  }

  initParticipantForm(groupParticipant: GroupParticipant): void {
    this.groupParticipantForm = this.formBuilder.modelGroup(GroupParticipant, groupParticipant, {
      display_name: ['', Validators.required],
    });
  }

  initGroupMeterForm(groupMeter: GroupMeter): void {
    this.groupMeterForm = this.formBuilder.modelGroup(GroupMeter, groupMeter, {
      name: ['', Validators.required],
      summary: [''],
      public: [null],
      public_key: ['', Validators.pattern('[0-9a-zA-Z-]*')],
      allow_invite: [true],
    });
  }

  leaveGroup(): void {
    if (confirm(`Weet je zeker dat je ${this.groupMeter.name} wil verlaten?`)) {
      const participant = new GroupParticipant().deserialize({active: false});
      this.groupParticipantService.updateGroupParticipant(this.user.pk, this.groupParticipant.pk, participant).subscribe(
        updatedParticipant => {
          this._snackBar.success({
            title: `Je hebt ${this.groupMeter.name} verlaten!`,
          });
          this.meterSelectionService.updateMeters(this.user);
        },
        error => {
          // TODO
        }
      );
    }
  }

  deleteGroup(): void {
    if (confirm(`Weet je zeker dat je ${this.groupMeter.name} wil verwijderen? Alle groep-gerelateerde data wordt verwijderd!`)) {
      this.groupMeterService.deleteGroupMeter(this.user.pk, this.groupMeter.pk).subscribe(
        result => {
          this._snackBar.success({
            title: `Je hebt ${this.groupMeter.name} verwijderd!`,
          });
          this.meterSelectionService.updateMeters(this.user);
        }
      );
    }
  }

  transferManager(participant?: GroupParticipant): void {
    const dialogRef = this.dialog.open(ChangeGroupManagerDialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        group: this.groupMeter,
        participant: participant,
      }
    });

    dialogRef.afterClosed().subscribe((result: ChangeGroupManagerDialogResult) => {
      if (result?.manager) {
        this._snackBar.success({
          title: `Groep is overgedragen naar ${result.manager.display_name}`,
        });
        this.meterSelectionService.updateMeters(this.user);
      }
    });
  }

  removeParticipant(participant: GroupParticipant): void {
    if (confirm(`Weet je zeker dat je ${participant.display_name} uit de groep wil verwijderen? `)) {
      const patchData = new GroupParticipant().deserialize({active: false});
      this.manageGroupParticipationService.updateGroupParticipant(this.groupMeter.pk, participant.pk, patchData).subscribe(
        result => {
          this._snackBar.success({
            title: `${participant.display_name} is uit de group verwijderd!`,
          });
          this.getGroupMeterData(this.groupMeter.pk);
        }
      );
    }
  }
}
