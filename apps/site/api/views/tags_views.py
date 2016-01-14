from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

class TagList(APIView):

    def get(self, request, *args, **kw):
        alltags = ["tag1", "tag2", "tag3", "tag4"]
        response = Response(alltags, status=status.HTTP_200_OK)
        return response
