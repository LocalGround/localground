from django.shortcuts import render_to_response
from localground.apps.site.models import Print, MapImage, Photo, Audio, Video, UserProfile
from django.contrib.auth.decorators import login_required
import simplejson as json
from django.template import RequestContext
from django.http import HttpResponse


@login_required()
def change_user_profile(request, template_name='account/user_prefs.html'):
    """
    Works in conjunction with CustomUserChangeForm, UserProfileForm to allow
    user to modify his/her preferences.
    """
    from django.contrib.auth.models import User
    # , MapGroupForm
    from localground.apps.site.forms import CustomUserChangeForm, UserProfileForm
    page_num = 1
    user_form, user_profile_form = None, None

    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profile = UserProfile()
        profile.user = request.user

    successfully_updated = False
    r = request.POST or request.GET
    page_num = int(r.get('page', '1'))
    if request.POST:
        if page_num == 1:
            user_form = CustomUserChangeForm(
                request.POST,
                instance=request.user)
            if user_form.is_valid():
                successfully_updated = True
                user_form.save()
        elif page_num == 2:
            user_profile_form = UserProfileForm(request.POST, instance=profile)
            if user_profile_form.is_valid():
                successfully_updated = True
                user_profile_form.save()
    if user_form is None:
        user_form = CustomUserChangeForm(instance=request.user)
    if user_profile_form is None:
        user_profile_form = UserProfileForm(instance=profile)

    # only allow deletions:
    user_profile_form.fields['contacts'].queryset = profile.contacts
    # help_text hack (help_text might be tied to the widget in future Django
    # versions)
    user_profile_form.fields['contacts'].help_text = 'Add additional contacts by \
		typing their username in the textbox above, and then clicking the add button.'

    forms = []
    user_form.title = 'Personal Info'
    forms.append(user_form)
    user_profile_form.title = 'Contacts / Privacy'
    forms.append(user_profile_form)

    #f = MapGroupForm()
    #f.title = 'Map Groups'
    # forms.append(f)

    # locals()
    extras = {
        'forms': forms,
        'page_num': page_num,
        'successfully_updated': successfully_updated
    }
    return render_to_response(template_name, extras,
                              context_instance=RequestContext(request))


@login_required()
def send_invitation(request):
    """
    Intended to be used to allow users to invite new users to Local Ground.
    Not currently being used -- needs to be re-integrated with the "Share"
    functionality (when assigning users to groups).
    """
    import re
    from localground.apps.lib.helpers.emailer import Email
    r = request.GET or request.POST
    email_string = r.get('recipients')
    subject = r.get('subject', None)
    body = r.get('body', None)
    if email_string is None or len(email_string) == 0:
        return HttpResponse(json.dumps({
            'success': False,
            'message': 'At least one email address must be supplied.'
        }))

    # parse emails
    email_string = re.sub(r'\s', '', email_string)  # remove all whitespace
    emails = re.split(',|;', email_string)  # split on delimiters
    message = 'Invitation email sent to: ' + ', '.join(emails) + '.'

    # instantiate emailer:
    emailer = Email()
    mail_success = emailer.send_invitation(
        emails,
        request.user,
        subject=subject,
        body=body)
    if not mail_success:
        message = 'There was an error sending the invitation email'
    return HttpResponse(
        json.dumps({'success': mail_success, 'message': message}))


@login_required()
def get_my_contacts_autocomplete(request):
    """
    Autocomplete for user's contacts (plaintext version).
    """
    q = request.GET.get('q')
    limit = int(request.GET.get('limit', '10'))
    if q is not None:
        emails = list(
            request.user.userprofile.contacts.filter(
                email__icontains=q) .values_list(
                'email', flat=True).order_by(
                'email',)[
                    :limit])
    else:
        emails = list(
            request.user.userprofile.contacts.values_list(
                'email', flat=True) .order_by(
                'email',)[
                :limit])
    return HttpResponse('\n'.join(emails), mimetype='text/plain')


@login_required()
def get_contacts_autocomplete(request, format='text'):
    """
    Autocomplete for Local Ground users (plaintext version).
    Todo:  consolidate with api.py/get_users_from_username_string.
    """
    from django.contrib.auth.models import User
    q = request.GET.get('q') or request.GET.get('query') \
        or request.GET.get('term')
    if q is None:
        return HttpResponse(json.dumps([]))

    format = format.lower()
    limit = int(request.GET.get('limit', '10'))
    try:
        if q is not None:
            users = list(User.objects.filter(username__icontains=q)
                         .order_by('username',)[:limit])
        else:
            users = list(User.objects.all()
                         .order_by('email',)[:limit])
        user_recs = []
        for u in users:
            uname = u.username
            if len(u.first_name) > 0 and len(u.last_name) > 0:
                uname += ' (' + u.first_name + ' ' + u.last_name + ')'
            elif len(u.first_name) > 0:
                uname += ' (' + u.first_name + ')'
            user_recs.append(dict(value=u.id, label=uname))
    except User.DoesNotExist:
        return HttpResponse('', mimetype='text/plain')
    if format != 'json':
        return HttpResponse(
            '\n'.join(
                u.get('label') for u in user_recs),
            mimetype='text/plain')
    else:
        return HttpResponse(json.dumps(user_recs), mimetype='text/json')
