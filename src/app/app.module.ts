import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material.module';

// firebase
import { firebaseConfig } from "../environments/environment";
import { AngularFireModule  } from 'angularfire2';
import { AngularFireAuthModule  } from 'angularfire2/auth';
import { AngularFireDatabaseModule  } from 'angularfire2/database';

// custom modules
import { CoreModule } from './core/core.module';
import { EditorModule } from './editor/editor.module';
import { ServiceModule } from './service-module/service.module';
import { VisualizationModule } from './visualization/visualization.module';

// component
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    ServiceModule,
    RouterModule.forRoot([]),
    EditorModule,
    VisualizationModule,
    CoreModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
