class ReturnCode():

    """
    Not really sure if this is used.
    """
    id = None
    name = None
    description = None

    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description


class ReturnCodes():

    """
    A look-up table of return codes for various operations on media models.
    Probably a better way to do this.
    """
    SUCCESS = 1
    UNAUTHORIZED = 2
    OBJECT_DOES_NOT_EXIST = 3
    OBJECT_TYPE_DOES_NOT_EXIST = 4
    LAT_LNG_REQUIRED = 5
    UNKNOWN_ERROR = 999

    messages = {}
    messages[SUCCESS] = 'Success'
    messages[UNAUTHORIZED] = 'You are not authorized to perform \
                                            this action'
    messages[OBJECT_DOES_NOT_EXIST] = 'Object not found'
    messages[OBJECT_TYPE_DOES_NOT_EXIST] = 'Object type not found'
    messages[LAT_LNG_REQUIRED] = 'Valid latitude and longitude \
                                                values are required'
    messages[UNKNOWN_ERROR] = 'Unknown error'

    @staticmethod
    def get_message(code):
        return ReturnCodes.messages.get(code)
