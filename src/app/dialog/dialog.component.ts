import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  taskForm !: FormGroup;
  actionBtn: string = "Save"

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService, private dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      task: ['', Validators.required],
      status: ['', Validators.required],
      comment: ['', Validators.required]
    });

    if (this.editData) {
      this.actionBtn = "Update"
      this.taskForm.controls['task'].setValue(this.editData.task);
      this.taskForm.controls['status'].setValue(this.editData.status);
      this.taskForm.controls['comment'].setValue(this.editData.comment);
    }

  }
  addTask() {
    if (!this.editData) {
      if (this.taskForm.valid) {
        this.api.postTask(this.taskForm.value)
          .subscribe({
            next: (res) => {
              alert("Task added sucessfully");
              this.taskForm.reset();
              this.dialogRef.close('save');
            },
            error: () => {
              alert("Error while adding the task")
            }
          })
      }
    } else {
      this.updateTask()
    }
  }
  updateTask() {
    this.api.putTask(this.taskForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          alert("Product updated Sucessfully");
          this.taskForm.reset();
          this.dialogRef.close('update');
        },
        error:()=>{
          alert("Error while updating the record!!");
        }
      })
  }

}
