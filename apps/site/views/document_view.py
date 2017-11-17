from django.contrib.auth.decorators import login_required
from django.views.generic.edit import CreateView
from django.core.urlresolvers import reverse_lazy

from localground.apps.site.models import Document


class DocumentCreateView(CreateView):
    model = Document
    fields = ['upload', ]
    success_url = reverse_lazy('home')

    def get_context_data(self, **kwargs):
        context = super(DocumentCreateView, self).get_context_data(**kwargs)
        documents = Document.objects.all()
        context['documents'] = documents
        return context
