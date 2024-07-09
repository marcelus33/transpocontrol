from rest_framework import filters


class DateRangeFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        start_date = request.query_params.get('date_start')
        end_date = request.query_params.get('date_end')

        if start_date and end_date:
            queryset = queryset.filter(date__range=(start_date, end_date))
        elif start_date:
            queryset = queryset.filter(date__gte=start_date)
        elif end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset


class DueDateRangeFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        start_due_date = request.query_params.get('due_date_start')
        end_due_date = request.query_params.get('due_date_end')

        if start_due_date and end_due_date:
            queryset = queryset.filter(due_date__range=(start_due_date, end_due_date))
        elif start_due_date:
            queryset = queryset.filter(due_date__gte=start_due_date)
        elif end_due_date:
            queryset = queryset.filter(due_date__lte=end_due_date)

        return queryset


class IsAnnulledFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        is_annulled = request.query_params.get('is_annulled')

        if is_annulled is not None and is_annulled.lower() == 'true':
            return queryset
        else:
            return queryset.filter(is_annulled=False)
