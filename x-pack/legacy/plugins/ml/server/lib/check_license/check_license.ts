/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { i18n } from '@kbn/i18n';
import { LICENSE_TYPE } from '../../../common/constants/license';
import { XPackInfo } from '../../../../../../legacy/plugins/xpack_main/server/lib/xpack_info';

interface Response {
  isAvailable: boolean;
  showLinks: boolean;
  enableLinks: boolean;
  licenseType?: LICENSE_TYPE;
  hasExpired?: boolean;
  message?: string;
}

export function checkLicense(xpackLicenseInfo: XPackInfo): Response {
  // If, for some reason, we cannot get the license information
  // from Elasticsearch, assume worst case and disable the Machine Learning UI
  if (!xpackLicenseInfo || !xpackLicenseInfo.isAvailable()) {
    return {
      isAvailable: false,
      showLinks: true,
      enableLinks: false,
      message: i18n.translate(
        'xpack.ml.checkLicense.licenseInformationNotAvailableThisTimeMessage',
        {
          defaultMessage:
            'You cannot use Machine Learning because license information is not available at this time.',
        }
      ),
    };
  }

  const featureEnabled = xpackLicenseInfo.feature('ml').isEnabled();
  if (!featureEnabled) {
    return {
      isAvailable: false,
      showLinks: false,
      enableLinks: false,
      message: i18n.translate('xpack.ml.checkLicense.mlIsUnavailableMessage', {
        defaultMessage: 'Machine Learning is unavailable',
      }),
    };
  }

  const VALID_FULL_LICENSE_MODES = ['platinum', 'enterprise', 'trial'];

  const isLicenseModeValid = xpackLicenseInfo.license.isOneOf(VALID_FULL_LICENSE_MODES);
  const licenseType = isLicenseModeValid === true ? LICENSE_TYPE.FULL : LICENSE_TYPE.BASIC;
  const isLicenseActive = xpackLicenseInfo.license.isActive();
  const licenseTypeName = xpackLicenseInfo.license.getType();

  // Platinum or trial license is valid but not active, i.e. expired
  if (licenseType === LICENSE_TYPE.FULL && isLicenseActive === false) {
    return {
      isAvailable: true,
      showLinks: true,
      enableLinks: true,
      hasExpired: true,
      licenseType,
      message: i18n.translate('xpack.ml.checkLicense.licenseHasExpiredMessage', {
        defaultMessage: 'Your {licenseTypeName} Machine Learning license has expired.',
        values: { licenseTypeName },
      }),
    };
  }

  // License is valid and active
  return {
    isAvailable: true,
    showLinks: true,
    enableLinks: true,
    licenseType,
    hasExpired: false,
  };
}
