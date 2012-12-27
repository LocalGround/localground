from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

context = {
    #'users': Print.objects.distinct().values('user__username',).order_by('user__username'),
    'users': User.objects.values('username',).filter(is_active=True).order_by('username')
}

project_context = context.copy()
project_context.update({
    'post_url': '/api/0/projects/' ,
    'test_fields': [
        {'name': 'id', 'type': 'text', 'desc': 'The unique \
         id of the project to which you have access', 'required': True},
        {'name': 'include_auth_users', 'type': 'bool', 'desc': 'Include users who \
            have specific permissions on that print', 'default': True,
            'required': False },
        {'name': 'include_processed_maps', 'type': 'bool', 'desc': 'Also return a \
            list of processed maps', 'default': False, 'required': False },
        {'name': 'include_markers', 'type': 'bool', 'desc': 'Also return a list \
            of markers', 'default': False, 'required': False },
        {'name': 'include_audio', 'type': 'bool', 'desc': 'Also return a list \
            of audio', 'default': False, 'required': False },
        {'name': 'include_photos', 'type': 'bool', 'desc': 'Also return a list \
            of photos', 'default': False, 'required': False },
        {'name': 'include_notes', 'type': 'bool', 'desc': 'Also return a list \
            of lists of tabular data corresponding to this project', 'default': False,
            'required': False }
    ]
})

my_projects_context = context.copy()
my_projects_context.update({
    'post_url': '/api/0/my-projects/' ,
    'test_fields': [
        {'name': 'include_auth_users', 'type': 'bool', 'desc': 'Include users who \
            have specific permissions on that print', 'default': True,
            'required': False },
        {'name': 'include_processed_maps', 'type': 'bool', 'desc': 'Also return a \
            list of processed maps', 'default': False, 'required': False },
        {'name': 'include_markers', 'type': 'bool', 'desc': 'Also return a list \
            of markers', 'default': False, 'required': False },
        {'name': 'include_audio', 'type': 'bool', 'desc': 'Also return a list \
            of audio', 'default': False, 'required': False },
        {'name': 'include_photos', 'type': 'bool', 'desc': 'Also return a list \
            of photos', 'default': False, 'required': False }
    ]
})

prints_context = context.copy()
prints_context.update({
    'post_url': '/api/0/my-prints/' ,
    'test_fields': [
        {'name': 'include_shared', 'type': 'bool', 'desc': 'Include prints \
            that have been specifically shared with you', 'default': True,
            'required': False },
        {'name': 'can_edit', 'type': 'bool', 'desc': 'Only show prints that \
         you have permissions to edit', 'default': False, 'required': False },
        {'name': 'can_manage', 'type': 'bool', 'desc': 'Only show prints that \
         you have permissions to manage', 'default': False, 'required': False },
        {'name': 'has_processed_images', 'type': 'bool', 'desc': 'Only \
            returns prints that have map submissions', 'default': True,
            'required': False }
        
    ]
})

print_context = context.copy()
print_context.update({
    'post_url': '/api/0/print/',
    'login_required': True,
    'test_fields': [
        {'name': 'print_id', 'type': 'text', 'desc': 'The 8-digit print \
         id of the print to which you have access', 'required': True},
         {'name': 'include_print_users', 'type': 'bool', 'desc': 'Also \
            return a list of users who have specific permissions on that print',
         'default': False, 'required': False },
         {'name': 'include_map_groups', 'type': 'bool', 'desc': 'Also \
            return all the groups to which the print belongs',
            'default': False, 'required': False
            },
        {'name': 'include_processed_maps', 'type': 'bool', 'desc': 'Also \
            return a list of processed maps (if applicable)', 'default': False,
            'required': False },
        {'name': 'include_markers', 'type': 'bool', 'desc': 'Also \
            return a list of markers (if applicable)', 'default': False,
            'required': False }
    ]
});

group_context = context.copy()
group_context.update({
    'post_url': '/api/0/group/',
    #'groups': MapGroup.objects.all().order_by('name',),
    'test_fields': [
        {'name': 'include_processed_maps', 'type': 'bool', 'desc': 'Also \
            return a list of processed maps (if applicable)', 'default': True,
            'required': False },
        {'name': 'include_markers', 'type': 'bool', 'desc': 'Also \
            return a list of markers (if applicable)', 'default': True,
            'required': False },
        {'name': 'include_prints', 'type': 'bool', 'desc': 'Also \
            return a list of prints (if applicable)', 'default': False,
            'required': False }
    ]
})

groups_context = context.copy()
groups_context.update({ 'post_url': '/api/0/my-groups/'})

photos_context = context.copy()
photos_context.update({ 'post_url': '/api/0/my-photos/'})

audio_context = context.copy()
audio_context.update({ 'post_url': '/api/0/my-audio/'})

users_context = context.copy()
users_context.update({
    'post_url': '/api/0/get-users-from-string/',
    'test_fields': [
        {'name': 'search_text', 'type': 'text', 'desc': 'A comma-delimited list \
         of valid usernames', 'required': True}
    ]
})

urlpatterns = patterns('',
    (r'^project/$', login_required(direct_to_template), {
        'template': 'base/api_tester.html',
        'extra_context': project_context
    }),
    (r'^my-projects/$', login_required(direct_to_template), {
        'template': 'base/api_tester.html',
        'extra_context': my_projects_context
    }),
    (r'^print/$', login_required(direct_to_template), {
        'template': 'base/api_tester.html',
        'extra_context': print_context
    }),
    (r'^my-prints/$', login_required(direct_to_template), {
        'template': 'base/api_tester.html',
        'extra_context': prints_context
    }),
    (r'^group/$', login_required(direct_to_template), {
        'template': 'base/api_tester.html',
        'extra_context': group_context
    }),
    (r'^my-groups/$', login_required(direct_to_template), {
        'template': 'base/api_tester.html',
        'extra_context': groups_context
    }),
    (r'^my-photos/$', login_required(direct_to_template), {
        'template': 'base/api_tester.html',
        'extra_context': photos_context
    }),
    (r'^my-audio/$', login_required(direct_to_template), {
        'template': 'base/api_tester.html',
        'extra_context': audio_context
    }),
    (r'^get-users-from-string/$', login_required(direct_to_template), {
        'template': 'base/api_tester.html',
        'extra_context': users_context
    })
   
)
