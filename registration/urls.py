"""
Backwards-compatible URLconf for existing django-registration
installs; this allows the standard ``include('registration.urls')`` to
continue working, but that usage is deprecated and will be removed for
django-registration 1.0. For new installs, use
``include('localground.registration.backends.default.urls')``.

"""

import warnings

warnings.warn("include('localground.registration.urls') is deprecated; use include('localground.registration.backends.default.urls') instead.",
              PendingDeprecationWarning)

from localground.registration.backends.default.urls import *
