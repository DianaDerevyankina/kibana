/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { KQL_INPUT } from '../screens/siem_header';

import { loginAndWaitForPage } from '../tasks/login';

import {
  mlHostMultiHostKqlQuery,
  mlHostMultiHostNullKqlQuery,
  mlHostSingleHostKqlQuery,
  mlHostSingleHostKqlQueryVariable,
  mlHostSingleHostNullKqlQuery,
  mlHostVariableHostKqlQuery,
  mlHostVariableHostNullKqlQuery,
  mlNetworkKqlQuery,
  mlNetworkMultipleIpKqlQuery,
  mlNetworkMultipleIpNullKqlQuery,
  mlNetworkNullKqlQuery,
  mlNetworkSingleIpKqlQuery,
  mlNetworkSingleIpNullKqlQuery,
} from '../urls/ml_conditional_links';

describe('ml conditional links', () => {
  it('sets the KQL from a single IP with a value for the query', () => {
    loginAndWaitForPage(mlNetworkSingleIpKqlQuery);
    cy.get(KQL_INPUT).should(
      'have.attr',
      'value',
      '(process.name: "conhost.exe" or process.name: "sc.exe")'
    );
  });

  it('sets the KQL from a multiple IPs with a null for the query', () => {
    loginAndWaitForPage(mlNetworkMultipleIpNullKqlQuery);
    cy.get(KQL_INPUT).should(
      'have.attr',
      'value',
      '((source.ip: "127.0.0.1" or destination.ip: "127.0.0.1") or (source.ip: "127.0.0.2" or destination.ip: "127.0.0.2"))'
    );
  });

  it('sets the KQL from a multiple IPs with a value for the query', () => {
    loginAndWaitForPage(mlNetworkMultipleIpKqlQuery);
    cy.get(KQL_INPUT).should(
      'have.attr',
      'value',
      '((source.ip: "127.0.0.1" or destination.ip: "127.0.0.1") or (source.ip: "127.0.0.2" or destination.ip: "127.0.0.2")) and ((process.name: "conhost.exe" or process.name: "sc.exe"))'
    );
  });

  it('sets the KQL from a $ip$ with a value for the query', () => {
    loginAndWaitForPage(mlNetworkKqlQuery);
    cy.get(KQL_INPUT).should(
      'have.attr',
      'value',
      '(process.name: "conhost.exe" or process.name: "sc.exe")'
    );
  });

  it('sets the KQL from a single host name with a value for query', () => {
    loginAndWaitForPage(mlHostSingleHostKqlQuery);
    cy.get(KQL_INPUT).should(
      'have.attr',
      'value',
      '(process.name: "conhost.exe" or process.name: "sc.exe")'
    );
  });

  it('sets the KQL from a multiple host names with null for query', () => {
    loginAndWaitForPage(mlHostMultiHostNullKqlQuery);
    cy.get(KQL_INPUT).should(
      'have.attr',
      'value',
      '(host.name: "siem-windows" or host.name: "siem-suricata")'
    );
  });

  it('sets the KQL from a multiple host names with a value for query', () => {
    loginAndWaitForPage(mlHostMultiHostKqlQuery);
    cy.get(KQL_INPUT).should(
      'have.attr',
      'value',
      '(host.name: "siem-windows" or host.name: "siem-suricata") and ((process.name: "conhost.exe" or process.name: "sc.exe"))'
    );
  });

  it('sets the KQL from a undefined/null host name but with a value for query', () => {
    loginAndWaitForPage(mlHostVariableHostKqlQuery);
    cy.get(KQL_INPUT).should(
      'have.attr',
      'value',
      '(process.name: "conhost.exe" or process.name: "sc.exe")'
    );
  });

  it('redirects from a single IP with a null for the query', () => {
    loginAndWaitForPage(mlNetworkSingleIpNullKqlQuery);
    cy.url().should(
      'include',
      '/app/siem#/network/ip/127.0.0.1/source?timerange=(global:(linkTo:!(timeline),timerange:(from:1566990000000,kind:absolute,to:1567000799999)),timeline:(linkTo:!(global),timerange:(from:1566990000000,kind:absolute,to:1567000799999)))'
    );
  });

  it('redirects from a single IP with a value for the query', () => {
    loginAndWaitForPage(mlNetworkSingleIpKqlQuery);
    cy.url().should(
      'include',
      "/app/siem#/network/ip/127.0.0.1/source?query=(language:kuery,query:'(process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22)')&timerange=(global:(linkTo:!(timeline),timerange:(from:1566990000000,kind:absolute,to:1567000799999)),timeline:(linkTo:!(global),timerange:(from:1566990000000,kind:absolute,to:1567000799999)))"
    );
  });

  it('redirects from a multiple IPs with a null for the query', () => {
    loginAndWaitForPage(mlNetworkMultipleIpNullKqlQuery);
    cy.url().should(
      'include',
      "app/siem#/network/flows?query=(language:kuery,query:'((source.ip:%20%22127.0.0.1%22%20or%20destination.ip:%20%22127.0.0.1%22)%20or%20(source.ip:%20%22127.0.0.2%22%20or%20destination.ip:%20%22127.0.0.2%22))')&timerange=(global:(linkTo:!(timeline),timerange:(from:1566990000000,kind:absolute,to:1567000799999)),timeline:(linkTo:!(global),timerange:(from:1566990000000,kind:absolute,to:1567000799999))"
    );
  });

  it('redirects from a multiple IPs with a value for the query', () => {
    loginAndWaitForPage(mlNetworkMultipleIpKqlQuery);
    cy.url().should(
      'include',
      "/app/siem#/network/flows?query=(language:kuery,query:'((source.ip:%20%22127.0.0.1%22%20or%20destination.ip:%20%22127.0.0.1%22)%20or%20(source.ip:%20%22127.0.0.2%22%20or%20destination.ip:%20%22127.0.0.2%22))%20and%20((process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22))')&timerange=(global:(linkTo:!(timeline),timerange:(from:1566990000000,kind:absolute,to:1567000799999)),timeline:(linkTo:!(global),timerange:(from:1566990000000,kind:absolute,to:1567000799999)))"
    );
  });

  it('redirects from a $ip$ with a null query', () => {
    loginAndWaitForPage(mlNetworkNullKqlQuery);
    cy.url().should(
      'include',
      '/app/siem#/network/flows?timerange=(global:(linkTo:!(timeline),timerange:(from:1566990000000,kind:absolute,to:1567000799999)),timeline:(linkTo:!(global),timerange:(from:1566990000000,kind:absolute,to:1567000799999)))'
    );
  });

  it('redirects from a $ip$ with a value for the query', () => {
    loginAndWaitForPage(mlNetworkKqlQuery);
    cy.url().should(
      'include',
      "/app/siem#/network/flows?query=(language:kuery,query:'(process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22)')&timerange=(global:(linkTo:!(timeline),timerange:(from:1566990000000,kind:absolute,to:1567000799999)),timeline:(linkTo:!(global),timerange:(from:1566990000000,kind:absolute,to:1567000799999)))"
    );
  });

  it('redirects from a single host name with a null for the query', () => {
    loginAndWaitForPage(mlHostSingleHostNullKqlQuery);
    cy.url().should(
      'include',
      '/app/siem#/hosts/siem-windows/anomalies?timerange=(global:(linkTo:!(timeline),timerange:(from:1559800800000,kind:absolute,to:1559887199999)),timeline:(linkTo:!(global),timerange:(from:1559800800000,kind:absolute,to:1559887199999)))'
    );
  });

  it('redirects from a host name with a variable in the query', () => {
    loginAndWaitForPage(mlHostSingleHostKqlQueryVariable);
    cy.url().should(
      'include',
      '/app/siem#/hosts/siem-windows/anomalies?timerange=(global:(linkTo:!(timeline),timerange:(from:1559800800000,kind:absolute,to:1559887199999)),timeline:(linkTo:!(global),timerange:(from:1559800800000,kind:absolute,to:1559887199999)))'
    );
  });

  it('redirects from a single host name with a value for query', () => {
    loginAndWaitForPage(mlHostSingleHostKqlQuery);
    cy.url().should(
      'include',
      "/app/siem#/hosts/siem-windows/anomalies?query=(language:kuery,query:'(process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22)')&timerange=(global:(linkTo:!(timeline),timerange:(from:1559800800000,kind:absolute,to:1559887199999)),timeline:(linkTo:!(global),timerange:(from:1559800800000,kind:absolute,to:1559887199999)))"
    );
  });

  it('redirects from a multiple host names with null for query', () => {
    loginAndWaitForPage(mlHostMultiHostNullKqlQuery);
    cy.url().should(
      'include',
      "/app/siem#/hosts/anomalies?query=(language:kuery,query:'(host.name:%20%22siem-windows%22%20or%20host.name:%20%22siem-suricata%22)')&timerange=(global:(linkTo:!(timeline),timerange:(from:1559800800000,kind:absolute,to:1559887199999)),timeline:(linkTo:!(global),timerange:(from:1559800800000,kind:absolute,to:1559887199999)))"
    );
  });

  it('redirects from a multiple host names with a value for query', () => {
    loginAndWaitForPage(mlHostMultiHostKqlQuery);
    cy.url().should(
      'include',
      "/app/siem#/hosts/anomalies?query=(language:kuery,query:'(host.name:%20%22siem-windows%22%20or%20host.name:%20%22siem-suricata%22)%20and%20((process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22))')&timerange=(global:(linkTo:!(timeline),timerange:(from:1559800800000,kind:absolute,to:1559887199999)),timeline:(linkTo:!(global),timerange:(from:1559800800000,kind:absolute,to:1559887199999)))"
    );
  });

  it('redirects from a undefined/null host name with a null for the KQL', () => {
    loginAndWaitForPage(mlHostVariableHostNullKqlQuery);
    cy.url().should(
      'include',
      '/app/siem#/hosts/anomalies?timerange=(global:(linkTo:!(timeline),timerange:(from:1559800800000,kind:absolute,to:1559887199999)),timeline:(linkTo:!(global),timerange:(from:1559800800000,kind:absolute,to:1559887199999)))'
    );
  });

  it('redirects from a undefined/null host name but with a value for query', () => {
    loginAndWaitForPage(mlHostVariableHostKqlQuery);
    cy.url().should(
      'include',
      "/app/siem#/hosts/anomalies?query=(language:kuery,query:'(process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22)')&timerange=(global:(linkTo:!(timeline),timerange:(from:1559800800000,kind:absolute,to:1559887199999)),timeline:(linkTo:!(global),timerange:(from:1559800800000,kind:absolute,to:1559887199999)))"
    );
  });
});
