'use client';

import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

function GlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: "@font-face {\n  font-family: Itim;\n  src: url(\"https://static.figma.com/font/Itim-Regular_1\") format(\"woff2\");\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}\n\n:root {\n  --green: #203d29;\n  --hero: #195330;\n  --teal: #0c756b;\n  --yellow: #ffbe00;\n  --muted: #536559;\n  --surface: #f5f8f5;\n  --placeholder: #e4ebe5;\n  --border: #dce5de;\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  min-width: 320px;\n  color: var(--green);\n  background: white;\n  font-family: Itim, sans-serif;\n}\n\nh1, h2, h3, p {\n  margin: 0;\n  font-weight: 400;\n}\n\nbutton, input, textarea, select {\n  font: inherit;\n}\n\nbutton {\n  border: 0;\n  padding: 0;\n  color: inherit;\n  background: transparent;\n  cursor: pointer;\n}\n\nbutton:focus-visible,\na:focus-visible {\n  outline: 2px solid var(--teal);\n  outline-offset: 4px;\n}\n\ninput, textarea, select {\n  min-width: 0;\n}\n\nimg {\n  display: block;\n  max-width: 100%;\n}\n\n.page {\n  min-height: 100vh;\n  background: #fff;\n}\n\n.topbar {\n  height: 60px;\n  padding: 0 22px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background: var(--green);\n}\n\n.brand {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  color: var(--yellow);\n  font-size: 30px;\n  line-height: 1;\n}\n\n.brand-icon {\n  font-size: 28px;\n}\n\n.topbar nav {\n  display: flex;\n  gap: 17px;\n}\n\n.topbar nav button {\n  min-width: 78px;\n  height: 28px;\n  padding: 0 12px;\n  border-radius: 8px;\n  color: #182b1e;\n  background: var(--yellow);\n  font-size: 13px;\n  font-weight: bold;\n}\n\n.content {\n  width: min(1000px, calc(100% - 40px));\n  margin: 0 auto;\n}\n\n.standard {\n  padding-top: 40px;\n  padding-bottom: 44px;\n}\n\n.standard > h1,\n.title-with-status h1 {\n  font-size: 34px;\n}\n\n.subtitle {\n  margin-top: 2px;\n  color: var(--muted);\n  font-size: 16px;\n}\n\n.primary {\n  height: 44px;\n  border-radius: 7px;\n  color: white;\n  background: var(--teal);\n  text-align: center;\n  font-size: 17px;\n}\n\n.primary.yellow {\n  color: var(--green);\n  background: var(--yellow);\n  font-weight: bold;\n}\n\n.centered {\n  display: block;\n  width: min(300px, 100%);\n  margin: 46px auto 0;\n  font-size: 18px;\n}\n\n.status {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 70px;\n  height: 23px;\n  padding: 0 10px;\n  border-radius: 12px;\n  font-size: 12px;\n  white-space: nowrap;\n}\n\n.status.green {\n  color: #245736;\n  background: #d1ecd8;\n}\n\n.status.yellow {\n  color: #70561a;\n  background: #ffe8a3;\n}\n\n.status.red {\n  color: #8e3229;\n  background: #f7cecb;\n}\n\n.field {\n  display: flex;\n  flex-direction: column;\n  gap: 9px;\n  min-width: 0;\n  font-size: 18px;\n}\n\n.field input,\n.field textarea,\n.field select {\n  width: 100%;\n  height: 50px;\n  padding: 8px 12px;\n  border: 1.5px solid #087c70;\n  border-radius: 4px;\n  color: var(--green);\n  background: white;\n}\n\n.field textarea {\n  height: 90px;\n  resize: vertical;\n}\n\n.field input:focus,\n.field textarea:focus,\n.field select:focus {\n  outline: 2px solid #0c756b33;\n  outline-offset: 2px;\n}\n\n.field input::placeholder {\n  color: var(--muted);\n  opacity: 1;\n  font-size: 15px;\n}\n\n.two-col {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 28px 40px;\n}\n\n.wide {\n  grid-column: 1 / -1;\n}\n\n/* Auth Pages */\n.auth-page {\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  min-height: calc(100vh - 60px);\n  padding: 42px 0 50px;\n}\n\n.auth-logo-text {\n  font-size: 64px;\n}\n\n.auth-page h1 {\n  margin-top: 14px;\n  color: #000;\n  font-size: 48px;\n}\n\n.auth-fields {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 32px 64px;\n  width: min(956px, calc(100% - 40px));\n  margin-top: 36px;\n}\n\n.auth-fields.login-fields {\n  display: flex;\n  flex-direction: column;\n  gap: 28px;\n  width: min(420px, calc(100% - 40px));\n}\n\n.auth-submit {\n  width: min(300px, calc(100% - 40px));\n  margin-top: 50px;\n}\n\n.text-link {\n  margin-top: 14px;\n  color: var(--teal);\n  font-size: 17px;\n  text-decoration: underline;\n}\n\n/* Home */\n.home {\n  background: var(--surface);\n}\n\n.hero {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 120px;\n  padding: 0 max(calc((100% - 1000px) / 2), 20px);\n  color: white;\n  background: var(--hero);\n}\n\n.hero h1 {\n  color: var(--yellow);\n  font-size: 34px;\n}\n\n.hero p {\n  margin-top: 8px;\n  font-size: 16px;\n}\n\n.hero button {\n  min-width: 130px;\n  width: auto;\n  padding: 0 16px;\n  height: 42px;\n  border: 1px solid white;\n  border-radius: 5px;\n  font-size: 15px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n\n.home-content {\n  display: grid;\n  grid-template-columns: minmax(0, 692px) minmax(0, 282px);\n  gap: 30px;\n  width: min(1000px, calc(100% - 40px));\n  margin: 0 auto;\n  padding: 29px 0 50px;\n}\n\n.section-title,\n.mini-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.section-title {\n  margin-bottom: 19px;\n}\n\n.section-title h2 {\n  font-size: 23px;\n}\n\n.section-title button {\n  color: #25593c;\n  font-size: 15px;\n  text-decoration: underline;\n}\n\n.pet-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 37px 16px;\n}\n\n.pet-card {\n  min-height: 250px;\n  height: auto;\n  overflow: hidden;\n  border: 1px solid #e0e7e1;\n  border-radius: 10px;\n  background: white;\n  text-align: left;\n  transition: transform 0.15s ease;\n  display: flex;\n  flex-direction: column;\n}\n\n.pet-card:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);\n}\n\n.pet-photo-container {\n  height: 142px;\n  width: 100%;\n  flex-shrink: 0;\n  overflow: hidden;\n  background: var(--placeholder);\n}\n\n.pet-photo-container img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.pet-placeholder {\n  display: grid;\n  place-items: center;\n  height: 142px;\n  color: var(--muted);\n  background: var(--placeholder);\n  font-size: 16px;\n}\n\n.pet-info {\n  display: flex;\n  align-items: flex-start;\n  flex-direction: column;\n  gap: 4px;\n  padding: 12px 13px;\n  flex: 1;\n}\n\n.pet-info strong {\n  margin-top: 1px;\n  font-size: 16px;\n  font-weight: 400;\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.pet-info > span {\n  font-size: 13px;\n  line-height: 1.4;\n  word-break: break-word;\n}\n\n.mini-apps {\n  height: 280px;\n  overflow-y: auto;\n  border: 1px solid #e0e7e1;\n  border-radius: 10px;\n  background: white;\n}\n\n.mini-head {\n  height: 46px;\n  padding: 0 15px;\n  border-bottom: 1px solid #edf0ed;\n}\n\n.mini-head h3 {\n  font-size: 16px;\n}\n\n.mini-head button {\n  color: #08766a;\n  font-size: 13px;\n}\n\n.mini-row {\n  display: grid;\n  grid-template-columns: 43px 1fr auto;\n  align-items: center;\n  gap: 11px;\n  height: 67px;\n  padding: 11px 10px 11px 15px;\n  border-bottom: 1px solid #edf0ed;\n}\n\n.mini-photo {\n  display: grid;\n  place-items: center;\n  width: 43px;\n  height: 43px;\n  border-radius: 7px;\n  color: var(--muted);\n  background: var(--placeholder);\n  font-size: 13px;\n  overflow: hidden;\n}\n\n.mini-photo img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.mini-copy {\n  display: flex;\n  flex-direction: column;\n  font-size: 13px;\n}\n\n.mini-copy strong {\n  font-size: 14px;\n  font-weight: 400;\n}\n\n/* แจ้งพบสัตว์ */\n.report {\n  padding-top: 42px;\n  padding-bottom: 40px;\n}\n\n.upload {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  width: min(632px, 100%);\n  height: 160px;\n  margin: 0 auto;\n  overflow: hidden;\n  border: 1.5px dashed #617465;\n  border-radius: 16px;\n  background: #f1efed;\n  font-size: 16px;\n  cursor: pointer;\n}\n\n.upload .upload-icon {\n  font-size: 40px;\n  margin-bottom: 8px;\n}\n\n.upload .preview {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.report .form-grid {\n  grid-template-columns: 230px 225px;\n  gap: 24px 125px;\n  width: 580px;\n  max-width: 100%;\n  margin: 32px auto 0;\n}\n\n.report .field {\n  font-size: 16px;\n}\n\n.submit-wide {\n  display: block;\n  width: min(436px, 100%);\n  height: 44px;\n  margin: 50px auto 0;\n}\n\n/* รายละเอียดสัตว์ */\n.detail {\n  display: grid;\n  grid-template-columns: minmax(0, 522px) minmax(0, 438px);\n  gap: 40px;\n  padding-top: 50px;\n  padding-bottom: 40px;\n}\n\n.main-photo {\n  display: grid;\n  place-items: center;\n  height: 366px;\n  overflow: hidden;\n  border-radius: 12px;\n  background: var(--placeholder);\n}\n\n.main-photo img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.thumbs {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 10px;\n  margin-top: 10px;\n}\n\n.thumbs div {\n  display: grid;\n  place-items: center;\n  height: 75px;\n  border-radius: 8px;\n  color: var(--muted);\n  background: var(--placeholder);\n  font-size: 14px;\n}\n\n.animal-copy h1 {\n  margin-top: 7px;\n  font-size: 26px;\n}\n\n.animal-copy > p {\n  margin-top: 14px;\n  font-size: 15px;\n  color: var(--muted);\n}\n\n.facts {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 9px;\n  margin-top: 20px;\n}\n\n.facts div,\n.caretaker {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  border: 1px solid #e0e7e1;\n  border-radius: 10px;\n  background: white;\n}\n\n.facts div {\n  height: 58px;\n}\n\n.facts span,\n.caretaker span {\n  font-size: 13px;\n  color: var(--muted);\n}\n\n.facts strong,\n.caretaker strong {\n  font-size: 15px;\n  font-weight: 400;\n}\n\n.animal-copy h3 {\n  margin-top: 18px;\n  font-size: 16px;\n}\n\n.animal-copy h3 + p {\n  margin-top: 6px;\n  font-size: 15px;\n  line-height: 1.5;\n}\n\n.caretaker {\n  align-items: flex-start;\n  height: 64px;\n  margin-top: 20px;\n  padding-left: 14px;\n}\n\n.animal-copy .primary {\n  width: 100%;\n  height: 44px;\n  margin-top: 22px;\n  font-size: 19px;\n}\n\n.animal-copy .note {\n  margin-top: 14px;\n  color: #334d3b;\n  font-size: 14px;\n  line-height: 1.4;\n}\n\n/* สมัครรับเลี้ยง */\n.narrow {\n  width: min(860px, calc(100% - 40px));\n}\n\n.animal-summary {\n  display: flex;\n  align-items: center;\n  gap: 22px;\n  height: 112px;\n  margin-top: 31px;\n  padding: 16px;\n  border-radius: 8px;\n  background: var(--surface);\n}\n\n.animal-summary img {\n  width: 142px;\n  height: 80px;\n  border-radius: 5px;\n  object-fit: cover;\n}\n\n.animal-summary h2 {\n  font-size: 22px;\n}\n\n.animal-summary p {\n  margin-top: 6px;\n  font-size: 16px;\n}\n\n.apply-form {\n  gap: 23px 40px;\n  margin-top: 29px;\n}\n\n/* ใบสมัครของฉัน */\n.application-list {\n  display: flex;\n  flex-direction: column;\n  gap: 25px;\n  margin-top: 37px;\n}\n\n.application-list article {\n  display: grid;\n  grid-template-columns: 124px 1fr 160px;\n  align-items: center;\n  gap: 26px;\n  height: 130px;\n  padding: 16px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n}\n\n.list-photo {\n  display: grid;\n  place-items: center;\n  width: 124px;\n  height: 94px;\n  border-radius: 6px;\n  color: var(--muted);\n  background: var(--placeholder);\n  font-size: 16px;\n  overflow: hidden;\n}\n\n.list-photo img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.list-copy h2 {\n  font-size: 22px;\n}\n\n.list-copy p {\n  margin-top: 5px;\n  color: var(--muted);\n  font-size: 16px;\n}\n\n.list-copy button {\n  margin-top: 3px;\n  color: var(--teal);\n  font-size: 16px;\n  text-decoration: underline;\n}\n\n.application-list .status {\n  width: 160px;\n  height: 32px;\n  font-size: 16px;\n}\n\n.footer-note {\n  margin-top: 52px;\n  color: var(--muted);\n  font-size: 16px;\n}\n\n/* พิจารณาใบสมัคร */\n.title-with-status {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.title-with-status > .status {\n  width: 164px;\n  height: 32px;\n  font-size: 16px;\n}\n\n.review-grid {\n  display: grid;\n  grid-template-columns: 308px 1fr;\n  gap: 40px;\n  margin-top: 32px;\n}\n\n.review-animal {\n  height: 350px;\n  padding: 18px;\n  border-radius: 8px;\n  background: var(--surface);\n}\n\n.review-animal img {\n  width: 272px;\n  height: 154px;\n  border-radius: 5px;\n  object-fit: cover;\n}\n\n.review-animal h2 {\n  margin-top: 13px;\n  font-size: 24px;\n}\n\n.review-animal p {\n  margin-top: 7px;\n  font-size: 16px;\n}\n\n.applicant {\n  height: 350px;\n  padding: 17px 21px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n}\n\n.applicant h2 {\n  font-size: 22px;\n}\n\n.applicant p {\n  margin-top: 14px;\n  font-size: 17px;\n}\n\n.applicant h3 {\n  margin-top: 24px;\n  font-size: 17px;\n}\n\n.review .review-note {\n  margin-top: 29px;\n}\n\n.review-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 30px;\n  margin-top: 33px;\n}\n\n.review-actions button {\n  width: 270px;\n  height: 44px;\n  font-size: 18px;\n}\n\n.reject {\n  border: 1px solid #a64b42;\n  border-radius: 7px;\n  color: #923d35;\n}\n\n/* ติดตามหลังรับเลี้ยง */\n.follow-summary {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 102px;\n  margin-top: 31px;\n  padding: 18px 20px;\n  border-radius: 8px;\n  background: var(--surface);\n}\n\n.follow-summary h2 {\n  font-size: 22px;\n}\n\n.follow-summary p {\n  margin-top: 5px;\n  font-size: 17px;\n}\n\n.follow-summary .status {\n  width: 150px;\n  height: 32px;\n  font-size: 16px;\n}\n\n.followup .form-grid {\n  gap: 25px 40px;\n  margin-top: 32px;\n}\n\n.followup .centered {\n  margin-top: 43px;\n}\n\n/* Timeline ประวัติการติดตามผล (Follow-up Timeline) */\n.followup-timeline-section {\n  border-top: 1px solid var(--border);\n  padding-top: 24px;\n}\n\n.timeline-container {\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  margin-top: 16px;\n}\n\n.timeline-item {\n  display: flex;\n  gap: 16px;\n  position: relative;\n}\n\n.timeline-badge-col {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 24px;\n  flex-shrink: 0;\n}\n\n.timeline-dot {\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  margin-top: 6px;\n  box-shadow: 0 0 0 4px var(--surface);\n  z-index: 1;\n}\n\n.dot-good {\n  background: #10b981;\n}\n\n.dot-attention {\n  background: #f59e0b;\n}\n\n.timeline-line {\n  width: 2px;\n  background: var(--border);\n  flex-grow: 1;\n  margin-top: 4px;\n  margin-bottom: -6px;\n}\n\n.timeline-card {\n  flex: 1;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  padding: 16px 20px;\n  margin-bottom: 20px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);\n}\n\n.timeline-card-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 12px;\n  margin-bottom: 10px;\n}\n\n.timeline-date {\n  font-weight: 600;\n  font-size: 16px;\n  color: var(--text);\n  display: block;\n}\n\n.timeline-author {\n  font-size: 13px;\n  color: var(--muted);\n  margin-top: 2px;\n  display: block;\n}\n\n.timeline-note {\n  font-size: 15px;\n  color: var(--text);\n  line-height: 1.6;\n  white-space: pre-wrap;\n  background: #f8fafc;\n  padding: 10px 14px;\n  border-radius: 6px;\n  border-left: 3px solid #cbd5e1;\n}\n\n.status-pill {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 20px;\n  font-size: 13px;\n  font-weight: 500;\n  white-space: nowrap;\n}\n\n.pill-good {\n  background: #ecfdf5;\n  color: #065f46;\n  border: 1px solid #a7f3d0;\n}\n\n.pill-attention {\n  background: #fffbeb;\n  color: #92400e;\n  border: 1px solid #fde68a;\n}\n\n.timeline-empty {\n  text-align: center;\n  padding: 32px 20px;\n  background: var(--surface);\n  border: 1px dashed var(--border);\n  border-radius: 10px;\n  color: var(--text);\n}\n\n/* Alert Notification */\n.alert {\n  padding: 12px 16px;\n  margin: 15px 0;\n  border-radius: 6px;\n  font-size: 15px;\n}\n.alert-error {\n  background: #fde8e8;\n  color: #9b1c1c;\n  border: 1px solid #f8b4b4;\n}\n.alert-success {\n  background: #def7ec;\n  color: #03543f;\n  border: 1px solid #84e1bc;\n}\n\n@media (max-width: 850px) {\n  .topbar {\n    padding: 0 14px;\n  }\n  .brand {\n    gap: 8px;\n    font-size: 25px;\n  }\n  .topbar nav {\n    gap: 7px;\n  }\n  .topbar nav button {\n    min-width: 0;\n    padding: 0 9px;\n  }\n  .hero {\n    padding: 18px 20px;\n  }\n  .hero h1 {\n    font-size: 28px;\n  }\n  .home-content {\n    grid-template-columns: 1fr;\n  }\n  .pet-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .auth-fields,\n  .two-col,\n  .detail,\n  .review-grid {\n    grid-template-columns: 1fr;\n  }\n  .report .form-grid {\n    grid-template-columns: 1fr;\n    gap: 20px;\n    width: 100%;\n  }\n  .application-list article {\n    grid-template-columns: 90px 1fr;\n    height: auto;\n  }\n  .review-actions {\n    flex-direction: column;\n  }\n  .review-actions button {\n    width: 100%;\n  }\n}\n\n@media (max-width: 520px) {\n  .pet-grid {\n    grid-template-columns: 1fr;\n  }\n  .auth-page h1 {\n    font-size: 38px;\n  }\n  .application-list article {\n    grid-template-columns: 1fr;\n  }\n  .title-with-status {\n    align-items: flex-start;\n    flex-direction: column;\n    gap: 12px;\n  }\n}\n/* Core styles */\r\n.counter {\r\n  font-size: 16px;\r\n  padding: 5px 10px;\r\n  border-radius: 5px;\r\n  color: var(--accent);\r\n  background: var(--accent-bg);\r\n  border: 2px solid transparent;\r\n  transition: border-color 0.3s;\r\n  margin-bottom: 24px;\r\n}\r\n.counter:hover { border-color: var(--accent-border); }\r\n.counter:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }\r\n\r\n/* Logo sizes */\r\n.auth-logo {\r\n  width: 80px;\r\n  margin-bottom: 0.5rem;\r\n}\r\n.navbar-logo {\r\n  height: 20px;\r\n  vertical-align: middle;\r\n}\r\n\r\n/* Popup */\r\n.popup-overlay {\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  background: rgba(0,0,0,0.5);\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  z-index: 1000;\r\n  cursor: pointer;\r\n}\r\n.popup {\r\n  background: #fff;\r\n  padding: 2rem 2.5rem 2rem;\r\n  border-radius: 16px;\r\n  box-shadow: 0 8px 32px rgba(0,0,0,0.25);\r\n  position: relative;\r\n  text-align: center;\r\n  cursor: default;\r\n  max-width: 380px;\r\n  width: 90%;\r\n}\r\n.popup-cat-img {\r\n  width: 200px;\r\n  height: auto;\r\n  display: block;\r\n  margin: 0 auto 1rem;\r\n}\r\n.popup-text {\r\n  color: #2a9d4e;\r\n  font-size: 1.3rem;\r\n  font-weight: 700;\r\n  margin: 0;\r\n}\r\n.close-btn {\r\n  position: absolute;\r\n  top: 0.75rem;\r\n  right: 0.75rem;\r\n  background: transparent;\r\n  border: none;\r\n  font-size: 1.4rem;\r\n  cursor: pointer;\r\n  color: #333;\r\n  line-height: 1;\r\n}\r\n.close-btn:hover {\r\n  color: #000;\r\n}\r\n\r\n/* Pet Updates Feed & Cards */\r\n.update-card {\r\n  background: #ffffff;\r\n  border: 1px solid var(--border);\r\n  border-radius: 12px;\r\n  padding: 20px;\r\n  margin-bottom: 24px;\r\n  box-shadow: 0 2px 8px rgba(0,0,0,0.04);\r\n}\r\n.update-media {\r\n  width: 100%;\r\n  max-height: 420px;\r\n  object-fit: contain;\r\n  background: #111;\r\n  border-radius: 8px;\r\n  margin: 14px 0;\r\n  display: block;\r\n}\r\n.feedback-box {\r\n  background: #f0fdf4;\r\n  border: 1.5px solid #86efac;\r\n  border-radius: 8px;\r\n  padding: 14px 16px;\r\n  margin-top: 14px;\r\n}\r\n.feedback-form {\r\n  background: #f8fafc;\r\n  border: 1.5px dashed #cbd5e1;\r\n  border-radius: 8px;\r\n  padding: 16px;\r\n  margin-top: 14px;\r\n}\r\n" }} />
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState('');

  // Hydrate user and token on client mount (safe for Next.js SSR)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
    } catch (e) {
      console.error('Error hydrating localStorage:', e);
    }
  }, []);

  // Global state
  const [animals, setAnimals] = useState([]);
  const [myAnimals, setMyAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [myApplications, setMyApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMsg, setErrorPopupMsg] = useState('');
  const [showAdoptPopup, setShowAdoptPopup] = useState(false);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setPage('login');
  };

  const handleLoginSuccess = (userData, userToken) => {
    setCurrentUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    fetchMyApplications(userToken);
    fetchAnimals();
    if (userData.role === 'caretaker') {
      fetchMyCaredAnimals(userData.id);
    }
    setPage('home');
  };

  // Fetch all animals for home page
  const fetchAnimals = async () => {
    try {
      const res = await fetch(`${API_BASE}/animals`);
      const data = await res.json();
      if (data.success) {
        setAnimals(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch animals:', err);
    }
  };

  // Fetch animals cared/announced by this caretaker
  const fetchMyCaredAnimals = async (caretakerId = currentUser?.id) => {
    if (!caretakerId) return;
    try {
      const res = await fetch(`${API_BASE}/animals?caretaker_id=${caretakerId}`);
      const data = await res.json();
      if (data.success) {
        setMyAnimals(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch my animals:', err);
    }
  };

  // Fetch applications
  const fetchMyApplications = async (authToken = token) => {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE}/adoption-applications/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setMyApplications(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  useEffect(() => {
    fetchAnimals();
    if (token) {
      fetchMyApplications();
      if (currentUser?.role === 'caretaker') {
        fetchMyCaredAnimals();
      }
    }
  }, [token]);

  // Status badge helper
  const renderStatus = (status) => {
    switch (status) {
      case 'street':
        return <span className="status yellow">รอผู้ดูแล / รับเลี้ยง</span>;
      case 'fostered':
        return <span className="status green">พร้อมรับเลี้ยง</span>;
      case 'adopted':
        return <span className="status green">รับเลี้ยงแล้ว</span>;
      case 'submitted':
        return <span className="status yellow">รอพิจารณา</span>;
      case 'reviewing':
        return <span className="status yellow">กำลังพิจารณา</span>;
      case 'approved':
        return <span className="status green">อนุมัติแล้ว</span>;
      case 'rejected':
        return <span className="status red">ไม่ผ่าน</span>;
      default:
        return <span className="status yellow">{status}</span>;
    }
  };

  // Topbar
  const Topbar = ({ auth = false }) => (
    <header className="topbar">
      <button type="button" className="brand" onClick={() => setPage('home')}>

        <span>Adopt Me</span>
      </button>

      <nav aria-label="เมนูหลัก">
        {auth ? (
          <button type="button" onClick={() => setPage('home')}>
            ‹ ย้อนกลับ
          </button>
        ) : currentUser ? (
          <>
            {currentUser.role === 'caretaker' && (
              <button
                type="button"
                onClick={() => {
                  fetchMyCaredAnimals();
                  setPage('my-animals');
                }}
              >
                สัตว์ที่ฉันดูแล ({myAnimals.length})
              </button>
            )}

            {currentUser.role !== 'admin' && (
              <button
                type="button"
                onClick={() => {
                  fetchMyApplications();
                  setPage('applications');
                }}
              >
                ใบสมัครของฉัน
              </button>
            )}

            <button type="button" onClick={handleLogout}>
              ออกจากระบบ ({currentUser.name?.split(' ')[0]})
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => setPage('login')}>
              เข้าสู่ระบบ
            </button>
            <button type="button" onClick={() => setPage('register')}>
              สมัครสมาชิก
            </button>
          </>
        )}
      </nav>
    </header>
  );

  /* ================= 1. HOME PAGE ================= */
  const HomePage = () => (
    <div className="page home">
      <Topbar />

      <section className="hero">
        <div>
          <h1>สวัสดี, {currentUser ? currentUser.name : 'ผู้เยี่ยมชม'}</h1>
          <p>พร้อมหาเพื่อนใหม่ที่ใช่แล้วหรือยัง?</p>
        </div>

        {/* ปุ่มแจ้งพบสัตว์/ลงทะเบียน: ใครก็สามารถกดโพสต์ได้ (Guest, Adopter, Caretaker) */}
        <button
          type="button"
          onClick={() => {
            setPage('report');
          }}
        >
          {currentUser?.role === 'caretaker' ? 'ลงทะเบียนสัตว์ใหม่' : 'แจ้งพบสัตว์ / ลงทะเบียนสัตว์'}
        </button>
      </section>

      <main className="home-content">
        <section>
          <div className="section-title">
            <h2>น้องๆ ที่รอบ้านอยู่</h2>
            <button type="button" onClick={fetchAnimals}>
              รีเฟรชรายการ
            </button>
          </div>

          <div className="pet-grid">
            {animals.length > 0 ? (
              animals.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  className="pet-card"
                  onClick={() => {
                    setSelectedAnimal(pet);
                    setPage('detail');
                  }}
                >
                  <div className="pet-photo-container">
                    {pet.photo_url ? (
                      <img src={pet.photo_url} alt={pet.name} />
                    ) : (
                      <div className="pet-placeholder">รูปสัตว์</div>
                    )}
                  </div>
                  <div className="pet-info">
                    {renderStatus(pet.status)}
                    <strong>{pet.name}</strong>
                    <span>
                      {pet.species === 'cat' ? 'แมว' : pet.species === 'dog' ? 'สุนัข' : 'สัตว์อื่นๆ'} ·{' '}
                      {pet.breed || pet.location_found || 'ไม่ระบุสายพันธุ์'}
                    </span>
                    {pet.caretaker_name && (
                      <span style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 500 }}>
                        ผู้ดูแล: {pet.caretaker_name}
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1', padding: '20px 0', color: 'var(--muted)' }}>
                ยังไม่มีข้อมูลสัตว์ในระบบ
              </p>
            )}
          </div>
        </section>

        <aside className="mini-apps">
          <div className="mini-head">
            <h3>
              {currentUser?.role === 'admin' || currentUser?.role === 'caretaker'
                ? 'ใบสมัครที่ส่งเข้ามา'
                : 'ใบสมัครของฉัน'}
            </h3>
            <button
              type="button"
              onClick={() => {
                fetchMyApplications();
                setPage(
                  currentUser?.role === 'admin' || currentUser?.role === 'caretaker'
                    ? 'review'
                    : 'applications'
                );
              }}
            >
              ดูทั้งหมด
            </button>
          </div>

          {(() => {
            // ถ้าเป็น caretaker ในกล่อง 'ใบสมัครที่ส่งเข้ามา' ให้แสดงเฉพาะใบสมัครที่คนอื่นส่งเข้ามาหาน้องของเรา
            const displayedApps = currentUser?.role === 'caretaker'
              ? myApplications.filter((app) => app.caretaker_id === currentUser?.id && app.applicant_id !== currentUser?.id)
              : myApplications;

            return displayedApps.length > 0 ? (
              displayedApps.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  className="mini-row"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedApp(app);
                    // ถ้าใบสมัครนี้เราเป็นผู้ขอรับเลี้ยง ให้ไปหน้า applications แต่ถ้าเป็นใบสมัครที่เราเป็นผู้ดูแล ให้ไปหน้า review
                    const isMyOwnApplication = app.applicant_id === currentUser?.id;
                    setPage(isMyOwnApplication ? 'applications' : 'review');
                  }}
                >
                  <div className="mini-photo">
                    {app.animal_photo_url ? (
                      <img src={app.animal_photo_url} alt={app.animal_name} />
                    ) : (
                      'รูป'
                    )}
                  </div>
                  <div className="mini-copy">
                    <strong>{app.animal_name}</strong>
                    <span>{new Date(app.submitted_at).toLocaleDateString('th-TH')}</span>
                  </div>
                  {renderStatus(app.status)}
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>
                {currentUser ? 'ยังไม่มีรายการใบสมัคร' : 'เข้าสู่ระบบเพื่อดูใบสมัคร'}
              </div>
            );
          })()}
        </aside>
      </main>
    </div>
  );

  /* ================= 2. AUTH PAGES (Login / Register) ================= */
  const AuthPage = ({ isRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('adopter');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const endpoint = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
      const payload = isRegister
        ? { name, email, phone, password, role, address }
        : { email, password };

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'เกิดข้อผิดพลาดในการทำรายการ');
        }

        if (isRegister) {
          handleLoginSuccess(data.data.user, data.data.token);
          setShowRegisterPopup(true);
        } else {
          handleLoginSuccess(data.data.user, data.data.token);
          setShowLoginPopup(true);
        }
      } catch (err) {
        if (!isRegister) {
          setErrorPopupMsg('ล็อคอินผิดพลาด');
        } else {
          setErrorPopupMsg(err.message || 'เกิดข้อผิดพลาดในการทำรายการ');
        }
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    // Redirect ไป backend /api/v1/auth/google → Google consent → callback → หน้าหลัก
    const handleGoogleLogin = () => {
      window.location.href = 'http://localhost:5000/api/v1/auth/google';
    };

    return (
      <div className="page">
        <Topbar auth={true} />
        <form className="auth-page" onSubmit={handleSubmit}>
          <img src="/logo.png" alt="AdoptMe" className="auth-logo" />
          <h1>{isRegister ? 'Register' : 'Login'}</h1>

          {alert && (
            <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {alert.msg}
            </div>
          )}

          <div className={`auth-fields ${isRegister ? '' : 'login-fields'}`}>
            {isRegister && (
              <label className="field">
                <span>ชื่อ - นามสกุล</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี"
                />
              </label>
            )}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />
            </label>

            {isRegister && (
              <>
                <label className="field">
                  <span>เบอร์โทรศัพท์</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812345678"
                  />
                </label>

                <label className="field">
                  <span>บทบาท (Role)</span>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="adopter">ผู้ขอรับเลี้ยง (Adopter)</option>
                    <option value="caretaker">ผู้ดูแลสัตว์ (Caretaker)</option>
                  </select>
                </label>

                <label className="field wide">
                  <span>ที่อยู่</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="บ้านเลขที่ ถนน แขวง เขต จังหวัด"
                  />
                </label>
              </>
            )}

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
              />
            </label>
          </div>

          <button type="submit" className="primary auth-submit" disabled={loading}>
            {loading ? 'กำลังประมวลผล...' : isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>

          {/* ───── Divider ───── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: 'min(300px, calc(100% - 40px))',
            margin: '16px 0',
            color: '#888',
            fontSize: '14px',
          }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #dce5de' }} />
            <span>หรือ</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #dce5de' }} />
          </div>

          {/* ───── ปุ่ม Google Sign-In ───── */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: 'min(300px, calc(100% - 40px))',
              height: '48px',
              border: '1.5px solid #dadce0',
              borderRadius: '8px',
              background: '#fff',
              color: '#3c4043',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              transition: 'box-shadow 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)')}
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)')}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            {isRegister ? 'สมัครด้วย Google' : 'เข้าสู่ระบบด้วย Google'}
          </button>

          <button
            type="button"
            className="text-link"
            style={{ marginTop: '18px' }}
            onClick={() => setPage(isRegister ? 'login' : 'register')}
          >
            {isRegister ? 'มีบัญชีแล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิก'}
          </button>
        </form>
      </div>
    );
  };

  /* ================= 3. ลงทะเบียนสัตว์ใหม่ (สงวนสิทธิ์เฉพาะ CARETAKER) ================= */
  const ReportPage = () => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('dog');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [personality, setPersonality] = useState('');
    const [health, setHealth] = useState('');
    const [locationFound, setLocationFound] = useState('');
    const [imageFiles, setImageFiles] = useState([]);   // array of File
    const [previewUrls, setPreviewUrls] = useState([]); // array of object URL
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);

    const handleClosePopup = () => {
      setShowPopup(false);
      if (registeredData) {
        handleLoginSuccess(registeredData.user, registeredData.token);
      }
    };

    // เพิ่มรูปใหม่เข้า list (ไม่เกิน 5 รูป)
    const handleFileChange = (e) => {
      const newFiles = Array.from(e.target.files);
      if (!newFiles.length) return;

      setImageFiles((prev) => {
        const combined = [...prev, ...newFiles].slice(0, 5);
        return combined;
      });
      setPreviewUrls((prev) => {
        const newUrls = newFiles.map((f) => URL.createObjectURL(f));
        return [...prev, ...newUrls].slice(0, 5);
      });
      // reset input ให้เลือกรูปเดิมซ้ำได้
      e.target.value = '';
    };

    // ลบรูปตาม index
    const handleRemoveImage = (idx) => {
      setImageFiles((prev) => prev.filter((_, i) => i !== idx));
      setPreviewUrls((prev) => {
        URL.revokeObjectURL(prev[idx]);
        return prev.filter((_, i) => i !== idx);
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('species', species);
      formData.append('breed', breed);
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('personality_note', personality);
      formData.append('health_condition', health);
      formData.append('location_found', locationFound);

      // ส่งทุกรูปใน field ชื่อ 'images'
      imageFiles.forEach((file) => formData.append('images', file));

      try {
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}/animals`, {
          method: 'POST',
          headers,
          body: formData,
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'ไม่สามารถลงทะเบียนสัตว์ได้');
        }

        const successMsg = currentUser?.role === 'caretaker'
          ? 'ลงทะเบียนสัตว์ใหม่เรียบร้อยแล้ว! สัตว์ตัวนี้จะบันทึกให้คุณเป็นผู้ดูแล'
          : 'แจ้งพบสัตว์ใหม่เรียบร้อยแล้ว! (สถานะ: รอรับเลี้ยง/ไม่ต้องรออนุมัติ)';
        showAlert(successMsg, 'success');
        fetchAnimals();
        if (currentUser?.role === 'caretaker') {
          fetchMyCaredAnimals();
          setPage('my-animals');
        } else {
          setPage('home');
        }
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="page">
        <Topbar />
        <main className="report content">
          <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '8px' }}>
            {currentUser?.role === 'caretaker' ? 'ลงทะเบียนสัตว์ใหม่' : 'แจ้งพบสัตว์ / ลงทะเบียนสัตว์'}
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '24px' }}>
            {currentUser
              ? `คุณกำลังลงทะเบียนในฐานะ: ${currentUser.name} (${currentUser.role})`
              : 'คุณกำลังโพสต์ในฐานะผู้เยี่ยมชม (Guest - สัตว์ตัวนี้จะเปิดให้รับเลี้ยงได้ทันทีไม่ต้องรออนุมัติ)'}
          </p>

          {alert && (
            <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {alert.msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ───── Upload Zone ───── */}
            <div style={{ marginBottom: '24px' }}>

              {/* Grid แสดง thumbnails + ปุ่มลบ */}
              {previewUrls.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}>
                  {previewUrls.map((url, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        width: '120px',
                        height: '100px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: idx === 0 ? '2.5px solid var(--teal)' : '1.5px solid #dce5de',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={url}
                        alt={`preview-${idx}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {/* badge "หลัก" สำหรับรูปแรก */}
                      {idx === 0 && (
                        <span style={{
                          position: 'absolute',
                          bottom: '4px',
                          left: '4px',
                          background: 'var(--teal)',
                          color: '#fff',
                          fontSize: '10px',
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}>
                          หลัก
                        </span>
                      )}
                      {/* ปุ่มลบ */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.55)',
                          color: '#fff',
                          fontSize: '13px',
                          lineHeight: '22px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: 'none',
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ปุ่ม Add รูป — ซ่อนถ้าครบ 5 รูปแล้ว */}
              {previewUrls.length < 5 && (
                <label
                  className="upload"
                  style={{ width: 'min(632px, 100%)', margin: '0 auto', cursor: 'pointer' }}
                >
                  <span className="upload-icon">📷</span>
                  <span>
                    {previewUrls.length === 0
                      ? 'กดเพื่อเพิ่มรูปภาพ (สูงสุด 5 รูป)'
                      : `เพิ่มรูปอีก (${previewUrls.length}/5)`}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </label>
              )}

              {previewUrls.length > 0 && (
                <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>
                  รูปแรก (กรอบสีเขียว) จะใช้เป็นรูปหน้าปก · ลากรูปออกได้ด้วยปุ่ม ×
                </p>
              )}
            </div>

            <div className="two-col form-grid">
              <label className="field">
                <span>ชื่อสัตว์ *</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น เจ้าหลง, น้องส้ม"
                />
              </label>

              <label className="field">
                <span>ชนิด *</span>
                <select value={species} onChange={(e) => setSpecies(e.target.value)}>
                  <option value="dog">สุนัข (Dog)</option>
                  <option value="cat">แมว (Cat)</option>
                  <option value="other">อื่นๆ (Other)</option>
                </select>
              </label>

              <label className="field">
                <span>เพศ</span>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">ผู้ (Male)</option>
                  <option value="female">เมีย (Female)</option>
                </select>
              </label>

              <label className="field">
                <span>สายพันธุ์</span>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="เช่น ไทยสลิด, บางแก้ว"
                />
              </label>

              <label className="field">
                <span>อายุ (โดยประมาณเป็นปี)</span>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="เช่น 1 หรือ 2"
                />
              </label>

              <label className="field">
                <span>สถานที่พบ / สถานที่ดูแล</span>
                <input
                  type="text"
                  value={locationFound}
                  onChange={(e) => setLocationFound(e.target.value)}
                  placeholder="เช่น บ้านพักชั่วคราว พญาไท"
                />
              </label>

              <label className="field wide">
                <span>นิสัย / พฤติกรรม</span>
                <textarea
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  placeholder="เช่น เชื่อง ขี้เล่น ชอบให้อุ้ม"
                />
              </label>

              <label className="field wide">
                <span>สภาพสุขภาพ</span>
                <textarea
                  value={health}
                  onChange={(e) => setHealth(e.target.value)}
                  placeholder="เช่น แข็งแรง ได้รับวัคซีนแล้ว"
                />
              </label>
            </div>

            <button type="submit" className="primary yellow submit-wide" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : 'ลงทะเบียนสัตว์'}
            </button>
          </form>
        </main>
      </div>
    );
  };

  /* ================= 4. สัตว์ที่ฉันดูแล (CARETAKER'S ANIMALS PAGE) ================= */
  const MyAnimalsPage = () => (
    <div className="page">
      <Topbar />
      <main className="content standard">
        <h1>สัตว์ที่ฉันดูแล (My Cared Animals)</h1>
        <p className="subtitle">
          รายการสัตว์ที่คุณเป็นคนลงทะเบียน (Caretaker: {currentUser?.name})
        </p>

        <div className="pet-grid" style={{ marginTop: '30px' }}>
          {myAnimals.length > 0 ? (
            myAnimals.map((pet) => (
              <button
                key={pet.id}
                type="button"
                className="pet-card"
                onClick={() => {
                  setSelectedAnimal(pet);
                  setPage('detail');
                }}
              >
                <div className="pet-photo-container">
                  {pet.photo_url ? (
                    <img src={pet.photo_url} alt={pet.name} />
                  ) : (
                    <div className="pet-placeholder">รูปสัตว์</div>
                  )}
                </div>
                <div className="pet-info">
                  {renderStatus(pet.status)}
                  <strong>{pet.name}</strong>
                  <span>
                    {pet.species === 'cat' ? 'แมว' : pet.species === 'dog' ? 'สุนัข' : 'สัตว์อื่นๆ'} ·{' '}
                    {pet.breed || pet.location_found || 'ไม่ระบุสายพันธุ์'}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px', color: 'var(--muted)' }}>
              คุณยังไม่มีสัตว์ในความดูแล สามารถกดปุ่ม 'ลงทะเบียนสัตว์ใหม่' ด้านบนได้เลยครับ
            </div>
          )}
        </div>
      </main>
    </div>
  );

  /* ================= 5. รายละเอียดสัตว์ / รับเป็นผู้ดูแล (DETAIL PAGE) ================= */
  const DetailPage = () => {
    const [pet, setPet] = useState(selectedAnimal);
    const [detailLoading, setDetailLoading] = useState(false);
    const [activePhoto, setActivePhoto] = useState(
      selectedAnimal?.photo_url || (selectedAnimal?.photo_urls && selectedAnimal.photo_urls[0]) || ''
    );

    // อัปเดตรูปหลักเมื่อข้อมูลสัตว์เปลี่ยน
    useEffect(() => {
      const initial = pet?.photo_urls && pet.photo_urls.length > 0 ? pet.photo_urls[0] : (pet?.photo_url || '');
      setActivePhoto(initial);
    }, [pet?.id, pet?.photo_url, pet?.photo_urls]);

    // ดึงข้อมูลสัตว์ล่าสุดผ่าน Endpoint GET /api/v1/animals/:id
    useEffect(() => {
      if (!selectedAnimal?.id) return;
      const fetchAnimalDetail = async () => {
        setDetailLoading(true);
        try {
          const res = await fetch(`${API_BASE}/animals/${selectedAnimal.id}`);
          const data = await res.json();
          if (data.success && data.data) {
            setPet(data.data);
          }
        } catch (err) {
          console.error('Failed to fetch animal detail:', err);
        } finally {
          setDetailLoading(false);
        }
      };

      fetchAnimalDetail();
    }, [selectedAnimal?.id]);

    if (!pet && !detailLoading) {
      return (
        <div className="page">
          <Topbar />
          <div className="content standard" style={{ textAlign: 'center' }}>
            <p>กรุณาเลือกสัตว์จากหน้าหลัก</p>
            <button className="primary yellow" onClick={() => setPage('home')} style={{ marginTop: '20px' }}>
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      );
    }

    const isMyPet = currentUser && pet.caretaker_id === currentUser.id;

    // รวบรวมรูปภาพทั้งหมด (รูปแรก = รูปหลัก, รูปที่เหลือ = รูปย่อย)
    const allPhotos = Array.isArray(pet?.photo_urls) && pet.photo_urls.length > 0
      ? pet.photo_urls
      : (pet?.photo_url ? [pet.photo_url] : []);
    const mainPhotoUrl = allPhotos[0] || pet?.photo_url || '';
    const subPhotos = allPhotos.slice(1);

    return (
      <div className="page">
        <Topbar />
        <main className="detail content">
          <section className="gallery" aria-label="รูปภาพสัตว์">
            <div
              className="main-photo"
              style={{
                cursor: activePhoto !== mainPhotoUrl ? 'pointer' : 'default',
              }}
              onClick={() => {
                if (activePhoto !== mainPhotoUrl) setActivePhoto(mainPhotoUrl);
              }}
              title={activePhoto !== mainPhotoUrl ? 'คลิกเพื่อกลับไปดูรูปหลัก' : ''}
            >
              {activePhoto ? (
                <img src={activePhoto} alt={pet.name} />
              ) : (
                <div style={{ color: 'var(--muted)', fontSize: '20px' }}>ไม่มีรูปภาพ</div>
              )}
            </div>

            {/* แสดงแถวรูปย่อยด้านล่างตามจำนวนรูปที่ใส่ (ตามตัวอย่างรูปที่ 2) */}
            {subPhotos.length > 0 && (
              <div className="thumbs">
                {subPhotos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhoto(activePhoto === photoUrl ? mainPhotoUrl : photoUrl)}
                    style={{
                      cursor: 'pointer',
                      overflow: 'hidden',
                      border: activePhoto === photoUrl ? '2.5px solid var(--teal)' : '1.5px solid #dce5de',
                      borderRadius: '8px',
                      position: 'relative',
                      background: 'var(--placeholder)',
                      height: '75px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                      boxShadow: activePhoto === photoUrl ? '0 3px 10px rgba(12,117,107,0.3)' : 'none',
                    }}
                    title={`คลิกเพื่อดู รูป ${idx + 2}`}
                  >
                    <img
                      src={photoUrl}
                      alt={`รูป ${idx + 2}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '3px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.55)',
                        color: '#fff',
                        fontSize: '11px',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        pointerEvents: 'none',
                      }}
                    >
                      รูป {idx + 2}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="animal-copy">
            {renderStatus(pet.status)}
            <h1>{pet.name}</h1>
            <p>
              สถานที่ดูแล: {pet.location_found || 'ไม่ระบุ'} · วันที่ลงทะเบียน:{' '}
              {new Date(pet.created_at).toLocaleDateString('th-TH')}
            </p>

            <div className="facts">
              <div>
                <span>ชนิด</span>
                <strong>{pet.species === 'cat' ? 'แมว' : pet.species === 'dog' ? 'สุนัข' : 'สัตว์อื่นๆ'}</strong>
              </div>
              <div>
                <span>สายพันธุ์</span>
                <strong>{pet.breed || 'ไม่ระบุ'}</strong>
              </div>
              <div>
                <span>เพศ</span>
                <strong>{pet.gender === 'male' ? 'ผู้' : pet.gender === 'female' ? 'เมีย' : 'ไม่ระบุ'}</strong>
              </div>
            </div>

            <h3>เกี่ยวกับน้อง</h3>
            <p>{pet.personality_note || 'ไม่มีข้อมูลนิสัยระบุไว้'}</p>
            <p><strong>สุขภาพ:</strong> {pet.health_condition || 'ปกติ'}</p>

            <div className="caretaker">
              <span>ผู้ดูแลปัจจุบัน</span>
              <strong>
                {pet.caretaker_name
                  ? isMyPet
                    ? `${pet.caretaker_name} (คุณเป็นผู้ดูแลสัตว์ตัวนี้)`
                    : pet.caretaker_name
                  : 'ไม่มีผู้ดูแล'}
              </strong>
            </div>

            {/* ปุ่มแอคชัน */}
            {isMyPet ? (
              <button
                type="button"
                className="primary yellow"
                onClick={() => {
                  fetchMyApplications();
                  setPage('review');
                }}
              >
                ดูใบสมัครรับเลี้ยงของสัตว์ตัวนี้
              </button>
            ) : pet.status === 'adopted' ? (
              <button type="button" className="primary" disabled style={{ background: '#9ca3af', cursor: 'not-allowed' }}>
                สัตว์ตัวนี้มีผู้รับเลี้ยงแล้ว
              </button>
            ) : (
              <button
                type="button"
                className="primary yellow"
                onClick={() => {
                  if (!currentUser) {
                    showAlert('กรุณาเข้าสู่ระบบก่อนสมัครขอรับเลี้ยง', 'error');
                    setPage('login');
                  } else {
                    setPage('apply');
                  }
                }}
              >
                {!pet.caretaker_id ? 'รับเลี้ยงสัตว์ตัวนี้ทันที' : 'สมัครรับเลี้ยงสัตว์ตัวนี้'}
              </button>
            )}

            <p className="note">
              {pet.caretaker_name
                ? `สัตว์ตัวนี้มีผู้ดูแลคือคุณ ${pet.caretaker_name} ซึ่งจะเป็นผู้พิจารณาอนุมัติใบสมัคร`
                : 'สัตว์ตัวนี้ไม่มีผู้ดูแล หากคุณกดขอรับเลี้ยง ระบบจะอนุมัติทันที'}
            </p>
          </section>
        </main>
      </div>
    );
  };

  /* ================= 6. สมัครรับเลี้ยง (APPLY PAGE) ================= */
  const ApplyPage = () => {
    const pet = selectedAnimal;
    const [applicantName, setApplicantName] = useState(currentUser ? currentUser.name : '');
    const [phone, setPhone] = useState(currentUser ? currentUser.phone || '' : '');
    const [address, setAddress] = useState(currentUser ? currentUser.address || '' : '');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);

    const handleClosePopup = () => {
      setShowPopup(false);
      if (registeredData) {
        handleLoginSuccess(registeredData.user, registeredData.token);
      }
    };

    if (!pet) {
      return (
        <div className="page">
          <Topbar />
          <div className="content standard" style={{ textAlign: 'center' }}>
            <p>กรุณาเลือกสัตว์ที่ต้องการรับเลี้ยง</p>
            <button className="primary yellow" onClick={() => setPage('home')}>
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      );
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!token) {
        showAlert('กรุณาเข้าสู่ระบบก่อนส่งใบสมัคร', 'error');
        setPage('login');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/adoption-applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            animal_id: pet.id,
            reason,
            home_environment: address,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'ส่งใบสมัครไม่สำเร็จ');
        }

        const successMessage = data.autoApproved
          ? '🎉 รับเลี้ยงสัตว์เรียบร้อยแล้ว! (สัตว์ตัวนี้โพสต์โดย Guest จึงได้รับการอนุมัติทันที)'
          : 'ส่งใบสมัครขอรับเลี้ยงสำเร็จ! กรุณารอ Caretaker พิจารณาอนุมัติ';
        showAlert(successMessage, 'success');
        await fetchMyApplications();
        await fetchAnimals();
        setShowAdoptPopup(true);
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="page">
        <Topbar />
        <main className="content standard narrow">
          <h1>สมัครรับเลี้ยง</h1>
          <p className="subtitle">สำหรับผู้ขอรับเลี้ยง (Adopter / Caretaker คนอื่น)</p>

          {alert && (
            <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {alert.msg}
            </div>
          )}

          <div className="animal-summary">
            {pet.photo_url ? (
              <img src={pet.photo_url} alt={pet.name} />
            ) : (
              <div style={{ width: '142px', height: '80px', background: 'var(--placeholder)', display: 'grid', placeItems: 'center' }}>
                รูปสัตว์
              </div>
            )}
            <div>
              <h2>{pet.name}</h2>
              <p>
                {pet.species === 'cat' ? 'แมว' : 'สุนัข'} · {pet.breed || 'ไม่ระบุสายพันธุ์'} · ผู้ดูแล:{' '}
                {pet.caretaker_name || 'ศูนย์ดูแลสัตว์'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="two-col form-grid apply-form">
              <label className="field">
                <span>ชื่อผู้สมัคร *</span>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                />
              </label>

              <label className="field">
                <span>เบอร์โทร *</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>

              <label className="field wide">
                <span>ที่อยู่และสภาพแวดล้อมที่เลี้ยงสัตว์ *</span>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="เช่น บ้านเดี่ยว มีรั้วรอบขอบชิด เลี้ยงระบบปิด มีสนามหญ้า"
                />
              </label>

              <label className="field wide">
                <span>เหตุผลที่ต้องการรับเลี้ยง *</span>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="เล่าประสบการณ์เลี้ยงสัตว์หรือความพร้อมในการดูแลน้อง"
                />
              </label>
            </div>

            <button type="submit" className="primary yellow centered" disabled={loading}>
              {loading ? 'กำลังส่งข้อมูล...' : 'ส่งใบสมัคร'}
            </button>
          </form>
        </main>
      </div>
    );
  };

  /* ================= 7. ใบสมัครของฉัน (APPLICATIONS PAGE) ================= */
  const ApplicationsPage = () => {
    // กรองเฉพาะใบสมัครที่ตัวเราเป็นคนยื่นขอรับเลี้ยง (applicant_id === currentUser.id)
    const mySubmittedApps = myApplications.filter(
      (app) => app.applicant_id === currentUser?.id || (!app.applicant_id && currentUser?.role !== 'admin')
    );

    return (
      <div className="page">
        <Topbar />
        <main className="content standard applications">
          <h1>ใบสมัครของฉัน</h1>
          <p className="subtitle">สถานะใบสมัครขอรับเลี้ยงที่คุณส่ง</p>

          {alert && (
            <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {alert.msg}
            </div>
          )}

          <div className="application-list">
            {mySubmittedApps.length > 0 ? (
              mySubmittedApps.map((app) => (
                <article key={app.id}>
                  <div className="list-photo">
                    {app.animal_photo_url ? (
                      <img src={app.animal_photo_url} alt={app.animal_name} />
                    ) : (
                      'รูปสัตว์'
                    )}
                  </div>
                  <div className="list-copy">
                    <h2>{app.animal_name}</h2>
                    <p>
                      ใบสมัคร #{app.id} · ส่งเมื่อ{' '}
                      {new Date(app.submitted_at).toLocaleDateString('th-TH')}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAnimal({
                            id: app.animal_id,
                            name: app.animal_name,
                            photo_url: app.animal_photo_url,
                            species: app.animal_species,
                            breed: app.animal_breed,
                            status: app.animal_status,
                          });
                          setPage('detail');
                        }}
                      >
                        ดูรายละเอียดสัตว์
                      </button>

                      {app.status === 'approved' && (
                        <button
                          type="button"
                          style={{
                            background: 'var(--teal)',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '5px',
                            fontSize: '14px',
                            textDecoration: 'none',
                          }}
                          onClick={() => {
                            setSelectedApp(app);
                            setPage('pet-updates');
                          }}
                        >
                          📸 อัปเดตน้อง / ดูคำแนะนำ Caretaker
                        </button>
                      )}
                    </div>
                  </div>
                  {renderStatus(app.status)}
                </article>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                ยังไม่มีประวัติการส่งใบสมัครขอรับเลี้ยง
              </div>
            )}
          </div>

          <p className="footer-note">แสดงเฉพาะใบสมัครของบัญชีที่เข้าสู่ระบบ</p>
        </main>
      </div>
    );
  };

  /* ================= 8. พิจารณาใบสมัคร (REVIEW PAGE - Caretaker & Admin) ================= */
  const ReviewPage = () => {
    // ใบสมัครที่เข้ามาให้เราพิจารณา:
    // สำหรับ Caretaker: สัตว์ตัวนั้นต้องมีเราเป็น caretaker (caretaker_id === currentUser.id)
    // และผู้สมัครต้องไม่ใช่ตัวเราเอง (applicant_id !== currentUser.id)
    const incomingApps = currentUser?.role === 'admin'
      ? myApplications
      : myApplications.filter(
        (app) => app.caretaker_id === currentUser?.id && app.applicant_id !== currentUser?.id
      );

    const [selectedReviewApp, setSelectedReviewApp] = useState(
      incomingApps.find((a) => a.id === selectedApp?.id) || incomingApps[0] || null
    );
    const [loading, setLoading] = useState(false);
    const [followUps, setFollowUps] = useState([]);
    const [loadingFollowUps, setLoadingFollowUps] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);

    // ดึงประวัติ Follow-up เมื่อเลือกใบสมัคร
    useEffect(() => {
      if (selectedReviewApp?.id && token) {
        setLoadingFollowUps(true);
        fetch(`${API_BASE}/follow-ups?application_id=${selectedReviewApp.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setFollowUps(data.data || []);
            }
          })
          .catch((err) => console.error('Error fetching follow-ups:', err))
          .finally(() => setLoadingFollowUps(false));
      }
    }, [selectedReviewApp?.id, token]);

    const handleClosePopup = () => {
      setShowPopup(false);
      if (registeredData) {
        handleLoginSuccess(registeredData.user, registeredData.token);
      }
    };

    const handleUpdateStatus = async (newStatus) => {
      if (!selectedReviewApp) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/adoption-applications/${selectedReviewApp.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'อัปเดตสถานะไม่สำเร็จ');
        }

        showAlert(
          `ปรับสถานะใบสมัครเป็น: ${newStatus === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'} เรียบร้อย`,
          'success'
        );
        fetchMyApplications();
        if (newStatus === 'approved') {
          setSelectedApp(selectedReviewApp);
          setPage('followup');
        } else {
          setPage('home');
        }
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedReviewApp) {
      return (
        <div className="page">
          <Topbar />
          <div className="content standard" style={{ textAlign: 'center' }}>
            <h2>ยังไม่มีใบสมัครส่งเข้ามาในสัตว์ที่คุณดูแล</h2>
            <button className="primary yellow" onClick={() => setPage('home')} style={{ marginTop: '20px' }}>
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="page">
        <Topbar />
        <main className="content standard review">
          <div className="title-with-status">
            <div>
              <h1>พิจารณาใบสมัคร</h1>
              <p className="subtitle">
                {currentUser?.role === 'admin'
                  ? 'ระบบพิจารณาโดย Admin (อนุมัติได้ทุกตัว)'
                  : `สำหรับผู้ดูแลสัตว์ (${currentUser?.name} - พิจารณาเฉพาะสัตว์ที่คุณดูแล)`}
              </p>
            </div>
            {renderStatus(selectedReviewApp.status)}
          </div>

          {incomingApps.length > 1 && (
            <div style={{ marginTop: '20px' }}>
              <span>เลือกใบสมัคร: </span>
              <select
                value={selectedReviewApp.id}
                onChange={(e) => {
                  const found = incomingApps.find((a) => a.id === Number(e.target.value));
                  if (found) setSelectedReviewApp(found);
                }}
                style={{ padding: '6px 12px', borderRadius: '4px', border: '1.5px solid #087c70' }}
              >
                {incomingApps.map((a) => (
                  <option key={a.id} value={a.id}>
                    ใบสมัคร #{a.id} - {a.animal_name} (ผู้สมัคร: {a.applicant_name || 'Adopter'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="review-grid">
            <section className="review-animal">
              {selectedReviewApp.animal_photo_url ? (
                <img src={selectedReviewApp.animal_photo_url} alt={selectedReviewApp.animal_name} />
              ) : (
                <div style={{ width: '100%', height: '154px', background: 'var(--placeholder)', display: 'grid', placeItems: 'center' }}>
                  รูปสัตว์
                </div>
              )}
              <h2>{selectedReviewApp.animal_name}</h2>
              <p>รหัสสัตว์: AN-{selectedReviewApp.animal_id}</p>
              <p>รหัสใบสมัคร: APP-{selectedReviewApp.id}</p>
              <p>ผู้ดูแลสัตว์: {selectedReviewApp.caretaker_name || currentUser?.name || 'Caretaker'}</p>
              <p>สถานะปัจจุบัน: {selectedReviewApp.status}</p>
            </section>

            <section className="applicant">
              <h2>ข้อมูลผู้ขอรับเลี้ยง</h2>
              <p><strong>ชื่อผู้สมัคร:</strong> {selectedReviewApp.applicant_name || 'ไม่ระบุ'}</p>
              <p><strong>เบอร์โทร:</strong> {selectedReviewApp.applicant_phone || 'ไม่ระบุ'}</p>
              <p><strong>อีเมล:</strong> {selectedReviewApp.applicant_email || 'ไม่ระบุ'}</p>
              <p><strong>สภาพแวดล้อมที่บ้าน:</strong> {selectedReviewApp.home_environment || 'ไม่ระบุ'}</p>
              <h3>เหตุผลที่ต้องการรับเลี้ยง</h3>
              <p>{selectedReviewApp.reason || 'ไม่ได้ระบุเหตุผล'}</p>
              <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--muted)' }}>
                ส่งเมื่อ {new Date(selectedReviewApp.submitted_at).toLocaleDateString('th-TH')}
              </p>
            </section>
          </div>

          {selectedReviewApp.status === 'approved' && selectedReviewApp.caretaker_id ? (
            <div className="review-actions">
              <button
                type="button"
                className="primary"
                style={{ background: 'var(--teal)', color: 'white' }}
                onClick={() => {
                  setSelectedApp(selectedReviewApp);
                  setPage('pet-updates');
                }}
              >
                📸 ดูอัปเดตจากผู้รับเลี้ยง & ให้คำแนะนำ
              </button>
              <button
                type="button"
                className="primary yellow"
                onClick={() => {
                  setSelectedApp(selectedReviewApp);
                  setPage('followup');
                }}
              >
                + บันทึกการติดตาม (Follow-up)
              </button>
            </div>
          ) : selectedReviewApp.status === 'approved' ? (
            <div className="review-actions">
              <span style={{ color: 'var(--teal)', fontSize: '16px', alignSelf: 'center', fontWeight: 500 }}>
                อนุมัติรับเลี้ยงแล้ว (สัตว์จาก Guest ไม่ต้องบันทึกติดตามผล)
              </span>
            </div>
          ) : selectedReviewApp.status === 'rejected' ? (
            <div className="review-actions">
              <span style={{ color: 'var(--muted)', fontSize: '16px', alignSelf: 'center' }}>
                ใบสมัครนี้ได้รับการปฏิเสธแล้ว
              </span>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateStatus('approved'); }}>
              <div className="review-actions">
                <button
                  type="button"
                  className="reject"
                  disabled={loading}
                  onClick={() => handleUpdateStatus('rejected')}
                >
                  ปฏิเสธใบสมัคร
                </button>
                <button type="submit" className="primary yellow" disabled={loading}>
                  {loading ? 'กำลังบันทึก...' : 'อนุมัติใบสมัคร'}
                </button>
              </div>
            </form>
          )}

          {/* ประวัติการติดตามผล (Follow-up Timeline) */}
          {selectedReviewApp.status === 'approved' && selectedReviewApp.caretaker_id && (
            <section className="followup-timeline-section" style={{ marginTop: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', margin: 0 }}>ประวัติการติดตามผลหลังรับเลี้ยง</h3>
                <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  บันทึกแล้ว {followUps.length} ครั้ง
                </span>
              </div>

              {loadingFollowUps ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
                  กำลังโหลดข้อมูลการติดตาม...
                </div>
              ) : followUps.length > 0 ? (
                <div className="timeline-container">
                  {followUps.map((item, idx) => (
                    <div key={item.id || idx} className="timeline-item">
                      <div className="timeline-badge-col">
                        <div className={`timeline-dot ${item.status === 'good' ? 'dot-good' : 'dot-attention'}`} />
                        {idx !== followUps.length - 1 && <div className="timeline-line" />}
                      </div>
                      <div className="timeline-card">
                        <div className="timeline-card-header">
                          <div>
                            <span className="timeline-date">
                              {item.visit_date ? new Date(item.visit_date).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }) : 'ไม่ระบุวันที่'}
                            </span>
                            <span className="timeline-author">โดย {item.caretaker_name || 'ผู้ดูแล'}</span>
                          </div>
                          <span className={`status-pill ${item.status === 'good' ? 'pill-good' : 'pill-attention'}`}>
                            {item.status === 'good' ? 'สภาพดี (Good)' : 'ต้องเฝ้าระวัง (Needs Attention)'}
                          </span>
                        </div>
                        <p className="timeline-note">{item.note || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="timeline-empty">
                  <p>ยังไม่มีบันทึกการติดตามผลสำหรับสัตว์ตัวนี้</p>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
                    กดปุ่ม "+ บันทึกการติดตาม" ด้านบน เพื่อเริ่มบันทึกครั้งแรก
                  </p>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    );
  };

  /* ================= 9. ติดตามหลังรับเลี้ยง (FOLLOW-UP PAGE) ================= */
  const FollowupPage = () => {
    const app = selectedApp || myApplications[0];
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('good');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);

    const handleClosePopup = () => {
      setShowPopup(false);
      if (registeredData) {
        handleLoginSuccess(registeredData.user, registeredData.token);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!token) {
        showAlert('กรุณาเข้าสู่ระบบในฐานะ Caretaker หรือ Admin', 'error');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/follow-ups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            application_id: app?.id,
            visit_date: visitDate,
            status,
            note,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'บันทึกการติดตามไม่สำเร็จ');
        }

        showAlert('บันทึกผลการติดตามหลังรับเลี้ยงเรียบร้อยแล้ว!', 'success');
        fetchMyApplications();
        if (currentUser?.role === 'caretaker' || currentUser?.role === 'admin') {
          setPage('review');
        } else {
          setPage('home');
        }
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="page">
        <Topbar />
        <main className="content standard narrow followup">
          <h1>ติดตามหลังรับเลี้ยง</h1>
          <p className="subtitle">บันทึกโดยผู้ดูแล (Caretaker) / Admin</p>

          <div className="follow-summary">
            <div>
              <h2>{app?.animal_name || 'สัตว์เลี้ยง'}</h2>
              <p>ใบสมัคร APP-{app?.id || '001'} · ผู้รับเลี้ยง: {app?.applicant_name || 'Adopter'}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setPage('review')}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: 'var(--text)',
                }}
              >
                ← ย้อนกลับ
              </button>
              {renderStatus('approved')}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="two-col form-grid">
              <label className="field">
                <span>วันที่ติดตาม *</span>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                />
              </label>

              <label className="field">
                <span>สถานะการติดตาม</span>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="good">สภาพความเป็นอยู่ดี (Good)</option>
                  <option value="needs_attention">ต้องติดตามเพิ่มเติม (Needs Attention)</option>
                </select>
              </label>

              <label className="field wide follow-result">
                <span>ผลการติดตามหลังรับเลี้ยง *</span>
                <textarea
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เช่น น้องปรับตัวเข้ากับบ้านใหม่ได้ดี สุขภาพแข็งแรง ร่าเริง กินอาหารได้ปกติ"
                />
              </label>
            </div>

            <button type="submit" className="primary yellow centered" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : 'บันทึกผลการติดตาม'}
            </button>
          </form>
        </main>
      </div>
    );
  };

  /* ================= 10. หน้าอัปเดตน้องจากบ้านใหม่ & ข้อเสนอแนะ Caretaker (PET UPDATES PAGE) ================= */
  const PetUpdatesPage = () => {
    const app = selectedApp;
    const [updates, setUpdates] = useState([]);
    const [loadingList, setLoadingList] = useState(false);

    // ฟอร์มส่งอัปเดตของ Adopter
    const [caption, setCaption] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState('image');
    const [submitting, setSubmitting] = useState(false);

    // State สำหรับข้อความ feedback แต่ละรายการของ Caretaker
    const [feedbackInputs, setFeedbackInputs] = useState({});
    const [sendingFeedbackId, setSendingFeedbackId] = useState(null);

    const isAdopter = currentUser?.id === app?.applicant_id;
    const isCaretaker = currentUser?.role === 'admin' || (currentUser?.role === 'caretaker' && (currentUser?.id === app?.caretaker_id || !app?.caretaker_id));

    const fetchUpdates = async () => {
      if (!app?.id || !token) return;
      setLoadingList(true);
      try {
        const res = await fetch(`${API_BASE}/pet-updates?application_id=${app.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setUpdates(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching pet updates:', err);
      } finally {
        setLoadingList(false);
      }
    };

    useEffect(() => {
      fetchUpdates();
    }, [app?.id]);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setMediaFile(file);
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setMediaType(type);
        setMediaPreview(URL.createObjectURL(file));
      }
    };

    const handlePostUpdate = async (e) => {
      e.preventDefault();
      if (!mediaFile) {
        showAlert('กรุณาเลือกรูปภาพหรือวิดีโอน้องเพื่ออัปเดต', 'error');
        return;
      }

      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('application_id', app.id);
        formData.append('caption', caption);
        formData.append('media', mediaFile);
        formData.append('media_type', mediaType);

        const res = await fetch(`${API_BASE}/pet-updates`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'ส่งอัปเดตไม่สำเร็จ');
        }

        showAlert('อัปเดตรูป/วิดีโอน้องจากบ้านใหม่ส่งถึงผู้ดูแลเรียบร้อยแล้ว!', 'success');
        setCaption('');
        setMediaFile(null);
        setMediaPreview(null);
        fetchUpdates();
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setSubmitting(false);
      }
    };

    const handleSendFeedback = async (updateId) => {
      const fbText = feedbackInputs[updateId];
      if (!fbText || !fbText.trim()) {
        showAlert('กรุณากรอกข้อความคำแนะนำ / Feedback ก่อนส่ง', 'error');
        return;
      }

      setSendingFeedbackId(updateId);
      try {
        const res = await fetch(`${API_BASE}/pet-updates/${updateId}/feedback`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ feedback: fbText }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'บันทึกคำแนะนำไม่สำเร็จ');
        }

        showAlert('ส่งคำแนะนำและ Feedback เรียบร้อยแล้ว', 'success');
        setFeedbackInputs((prev) => ({ ...prev, [updateId]: '' }));
        fetchUpdates();
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setSendingFeedbackId(null);
      }
    };

    return (
      <div className="page">
        <Topbar />
        <main className="content standard narrow">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h1>อัปเดตน้องจากบ้านใหม่ & คำแนะนำการเลี้ยงดู</h1>
              <p className="subtitle">
                {app?.animal_name} · ใบสมัคร APP-{app?.id} · ผู้รับเลี้ยง: {app?.applicant_name || currentUser?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (currentUser?.role === 'caretaker' || currentUser?.role === 'admin') {
                  setPage('review');
                } else {
                  setPage('applications');
                }
              }}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                color: 'var(--text)',
                fontWeight: 500,
              }}
            >
              ← ย้อนกลับ
            </button>
          </div>

          {alert && (
            <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {alert.msg}
            </div>
          )}

          {/* ส่วนของผู้รับเลี้ยง (Adopter) อัปเดตรูปถ่าย / วิดีโอ */}
          {isAdopter && (
            <section
              style={{
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
              }}
            >
              <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
                📸 ส่งรูปถ่าย / วิดีโอน้องจากบ้านใหม่ให้ผู้ดูแล (Caretaker)
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '20px' }}>
                ร่วมแบ่งปันความสดใสและพัฒนาการของน้อง เพื่อรับคำแนะนำการดูแลจาก Caretaker
              </p>

              <form onSubmit={handlePostUpdate}>
                <label className="upload" style={{ height: mediaPreview ? 'auto' : '150px', padding: mediaPreview ? '12px' : 0 }}>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  {mediaPreview ? (
                    mediaType === 'video' ? (
                      <video src={mediaPreview} controls style={{ maxHeight: '280px', maxWidth: '100%', borderRadius: '8px' }} />
                    ) : (
                      <img src={mediaPreview} alt="Preview" style={{ maxHeight: '280px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                    )
                  ) : (
                    <>
                      <span className="upload-icon">📷 / 🎥</span>
                      <span>คลิกเพื่อแนบรูปถ่าย หรือคลิปวิดีโอน้อง</span>
                    </>
                  )}
                </label>

                <div className="field wide" style={{ marginTop: '16px' }}>
                  <span>ข้อความบอกเล่าชีวิตประจำวัน / อาการ / พฤติกรรมของน้อง</span>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="เช่น วันนี้น้องกินเก่งมาก วิ่งเล่นร่าเริง ปรับตัวกับที่นอนใหม่ได้ดีมากครับ..."
                    style={{ height: '80px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button
                    type="submit"
                    className="primary"
                    disabled={submitting}
                    style={{
                      background: 'var(--teal)',
                      color: 'white',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                    }}
                  >
                    {submitting ? 'กำลังส่งข้อมูล...' : '🚀 ส่งอัปเดตให้น้อง'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* รายการอัปเดตและ Feedback ทั้งหมด */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '22px' }}>บันทึกอัปเดตชีวิตน้องจากบ้านใหม่</h2>
              <button
                type="button"
                onClick={fetchUpdates}
                style={{ color: 'var(--teal)', textDecoration: 'underline', fontSize: '15px' }}
              >
                รีเฟรชอัปเดต
              </button>
            </div>

            {loadingList ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                กำลังโหลดข้อมูลอัปเดต...
              </div>
            ) : updates.length > 0 ? (
              <div>
                {updates.map((item) => (
                  <article key={item.id} className="update-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '17px' }}>{item.adopter_name || 'ผู้รับเลี้ยง'}</strong>
                        <span style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '8px' }}>
                          {new Date(item.created_at).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <span className="status-pill pill-good">
                        {item.media_type === 'video' ? '🎥 วิดีโอ' : '📷 รูปถ่าย'}
                      </span>
                    </div>

                    {item.caption && (
                      <p style={{ marginTop: '12px', fontSize: '16px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {item.caption}
                      </p>
                    )}

                    {item.media_url && (
                      item.media_type === 'video' || item.media_url.endsWith('.mp4') || item.media_url.endsWith('.webm') ? (
                        <video src={item.media_url} controls className="update-media" />
                      ) : (
                        <img src={item.media_url} alt="น้องจากบ้านใหม่" className="update-media" />
                      )
                    )}

                    {/* กล่อง Feedback ที่ Caretaker ตอบแล้ว */}
                    {item.feedback ? (
                      <div className="feedback-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <strong style={{ color: '#166534', fontSize: '15px' }}>
                            💬 คำแนะนำการเลี้ยงดูจากผู้ดูแล ({item.feedback_by_name || 'Caretaker'}):
                          </strong>
                          {item.feedback_at && (
                            <span style={{ fontSize: '12px', color: '#166534' }}>
                              {new Date(item.feedback_at).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#14532d', fontSize: '15px', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap' }}>
                          {item.feedback}
                        </p>
                      </div>
                    ) : (
                      <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic' }}>
                        ⏳ ยังไม่มีคำแนะนำจาก Caretaker สำหรับอัปเดตนี้
                      </div>
                    )}

                    {/* ฟอร์มสำหรับ Caretaker ในการตอบ Feedback หรือแก้ไขคำแนะนำ */}
                    {isCaretaker && (
                      <div className="feedback-form">
                        <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                          {item.feedback ? '✏️ อัปเดต/แก้ไขคำแนะนำในการเลี้ยงดู:' : '💬 พิมพ์ Feedback / คำแนะนำในการเลี้ยงดูให้น้อง:'}
                        </label>
                        <textarea
                          placeholder="พิมพ์คำแนะนำ เช่น ปริมาณอาหาร การฉีดวัคซีน การปรับพฤติกรรม หรือข้อเสนอแนะในการดูแล..."
                          value={feedbackInputs[item.id] !== undefined ? feedbackInputs[item.id] : (item.feedback || '')}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFeedbackInputs((prev) => ({ ...prev, [item.id]: val }));
                          }}
                          style={{
                            width: '100%',
                            minHeight: '75px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #94a3b8',
                            fontSize: '15px',
                            fontFamily: 'inherit',
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                          <button
                            type="button"
                            className="primary yellow"
                            style={{
                              padding: '6px 16px',
                              height: '36px',
                              borderRadius: '6px',
                              fontSize: '14px',
                            }}
                            disabled={sendingFeedbackId === item.id}
                            onClick={() => handleSendFeedback(item.id)}
                          >
                            {sendingFeedbackId === item.id ? 'กำลังส่งคำแนะนำ...' : 'ส่งคำแนะนำให้ผู้รับเลี้ยง'}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '10px' }}>
                <p style={{ fontSize: '18px', color: 'var(--text)' }}>ยังไม่มีการส่งอัปเดตรูปถ่ายหรือวิดีโอ</p>
                <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
                  {isAdopter ? 'ส่งรูปภาพหรือวิดีโอแรกของน้องด้านบนเพื่อเริ่มบันทึก!' : 'เมื่อผู้รับเลี้ยงส่งรูปถ่าย/วิดีโอน้องเข้ามา จะแสดงขึ้นที่นี่'}
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  };

  // Router View
  const renderPage = () => {
    switch (page) {
      case 'login':
        return <AuthPage isRegister={false} />;
      case 'register':
        return <AuthPage isRegister={true} />;
      case 'report':
        return <ReportPage />;
      case 'my-animals':
        return <MyAnimalsPage />;
      case 'detail':
        return <DetailPage />;
      case 'apply':
        return <ApplyPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'review':
        return <ReviewPage />;
      case 'followup':
        return <FollowupPage />;
      case 'pet-updates':
        return <PetUpdatesPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <GlobalStyles />
      {renderPage()}
      {showRegisterPopup && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'pointer',
          }}
          onClick={() => setShowRegisterPopup(false)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px', padding: '2rem 2.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative', textAlign: 'center', maxWidth: '380px', width: '90%', cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: '#333' }}
              onClick={() => setShowRegisterPopup(false)}
            >✕</button>
            <img src="/popup-cat.png" alt="แมวน้อย" style={{ width: '220px', height: 'auto', display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ color: '#2a9d4e', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>ลงทะเบียนสำเร็จ</p>
          </div>
        </div>
      )}
      {showLoginPopup && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'pointer',
          }}
          onClick={() => setShowLoginPopup(false)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px', padding: '2rem 2.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative', textAlign: 'center', maxWidth: '380px', width: '90%', cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: '#333' }}
              onClick={() => setShowLoginPopup(false)}
            >✕</button>
            <img src="/popup-cat.png" alt="แมวน้อย" style={{ width: '220px', height: 'auto', display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ color: '#2a9d4e', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>เข้าสู่ระบบสำเร็จ</p>
          </div>
        </div>
      )}
      {showErrorPopup && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'pointer',
          }}
          onClick={() => setShowErrorPopup(false)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px', padding: '2rem 2.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative', textAlign: 'center', maxWidth: '380px', width: '90%', cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: '#333' }}
              onClick={() => setShowErrorPopup(false)}
            >✕</button>
            <img src="/popup-cat-error.png" alt="เกิดข้อผิดพลาด" style={{ width: '220px', height: 'auto', display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ color: '#e53e3e', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{errorPopupMsg}</p>
          </div>
        </div>
      )}
      {showAdoptPopup && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'pointer',
          }}
          onClick={() => { setShowAdoptPopup(false); setPage('applications'); }}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px', padding: '2rem 2.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative', textAlign: 'center', maxWidth: '380px', width: '90%', cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: '#333' }}
              onClick={() => { setShowAdoptPopup(false); setPage('applications'); }}
            >✕</button>
            <img src="/popup-adopt.png" alt="ส่งคำขอสำเร็จ" style={{ width: '220px', height: 'auto', display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ color: '#2a9d4e', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              ส่งคำขอรับเลี้ยงสำเร็จ<br />กำลังรออนุมัติ
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
