// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule }    from '@angular/material/icon';
import { MatButtonModule }  from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar class="app-toolbar">
      <button mat-icon-button aria-label="Search">
        <mat-icon>search</mat-icon>
      </button>
      <span class="toolbar-title">LogiChain</span>
      <button mat-icon-button aria-label="Menu">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>

    <div class="hero">
      <div class="hero-item hero-item--image">
        <img src="assets/bis.png" alt="SEEBURGER BIS Platform">
      </div>
      <div class="hero-item hero-item--content">
        <h2>Effizienz Steigerung<br>durch Seeburger <span>LogiChain</span></h2>
        <div class="stats">
          <div class="stat">
            <img src="assets/fsi.svg" alt="" class="stat-icon">
            <div class="stat-value">12 Mio.</div>
            <div class="stat-label">Paketzustellungen unterstützt BIS wöchentlich.</div>
          </div>
          <div class="stat">
            <img src="assets/automotive.svg" alt="" class="stat-icon">
            <div class="stat-value">15 Bill. €</div>
            <div class="stat-label">Zahlungen werden jährlich von BIS sicher und vollautomatisch übertragen.</div>
          </div>
          <div class="stat">
            <img src="assets/logistic.svg" alt="" class="stat-icon">
            <div class="stat-value">70 %</div>
            <div class="stat-label">der Top 100 Automobilzulieferer in Deutschland vertrauen BIS.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="secondary">
      <div class="secondary-item secondary-item--text">
        <h3>Warum LogiChain mit SEEBURGER?</h3>
        <p>Ein zentraler Dreh- und Angelpunkt: Ihre Experience, alle Integrationen<br>
        und alle Bereitstellungsmodelle auf der leistungsstarken SEEBURGER BIS Plattform</p>
        <br>
        <p>LogiChain vernetzt Anwendungen, Partner und Prozesse nahtlos – egal ob in der Cloud,<br>
        in hybriden Umgebungen oder On-Premises.</p> <br>
        <p>Mit LogiChain gestalten Sie einfache E-Procurement-Szenarien bis hin zu komplexen<br>
        Blockchain-basierten Supply-Chain-Prozessen eigenständig und stärken so<br>
        das digitale Rückgrat Ihres Unternehmens.</p> <br>
        <p>LogiChain wird gemeinsam mit SEEBURGER realisiert – Ihrem erfahrenen<br>
        Integrationsservice- und Softwareanbieter. Seit 1986 in Familienbesitz,<br>
        beschäftigt SEEBURGER heute über 1.200 Mitarbeiter weltweit.</p> <br>
        <p>Mehr als 14.000 Kunden vertrauen täglich auf Integrationskompetenz „Made in Germany“.</p> <br>
        <p>Mit LogiChain bündeln wir diese Expertise und schaffen eine moderne, sichere<br>
        und skalierbare Lösung für Ihr digitales Ökosystem.</p>
        <div class="more-link">
          <span class="arrow-icon"></span>
          <span>Erfahren Sie mehr</span>
        </div>    
        </div>
      <div class="secondary-item secondary-item--video">
        <div class="video-thumb">
          <video class="video-element" controls poster="assets/video-poster.jpg">
            <source src="assets/video-thumb.mp4" type="video/mp4">
            Ihr Browser unterstützt HTML5-Video nicht.
          </video>
          <button class="play-button" aria-label="Play Video"><mat-icon>play_circle</mat-icon></button>
        </div>
      </div>
    </div>

    <footer class="app-footer">
      Seeburger AG · Impressum · Datenschutz & Cookies · Login · Nachhaltigkeit
    </footer>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
