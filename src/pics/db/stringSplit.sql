create or alter function dbo.stringSplit (
	@delimiter nvarchar(15) = ',',
	@string nvarchar(max) = 'apple,orange,banana,grape'
)
returns table as return 

select
	id = ROW_NUMBER() over (order by root.node),
  val = LTRIM(RTRIM(root.node.value('.[1]', 'varchar(8000)')))
from (select val = replace(@string, @delimiter, '</row><row>')) as commaReplaced
cross apply (select val = '<root><row>' + commaReplaced.val + '</row></root>') as stringXml
cross apply (select val = convert(xml,stringXml.val)) as trueXml
cross apply trueXml.val.nodes('/root/row[position()]') root(node)
